import type { NextApiRequest, NextApiResponse } from "next";
import connect from "@/lib/db";
import KnowledgeBaseArticle from "@/lib/models/KnowledgeBaseArticle";
import AboutContent from "@/lib/models/AboutContent";

interface ChatMessage {
  role: "user" | "agent";
  message: string;
}

type KbLean = {
  title: string;
  content: string;
  keywords?: string[];
  isPublished?: boolean;
};

type AboutLean = {
  title: string;
  body: string;
  heroImageUrl?: string | null;
};

type Candidate = {
  title: string;
  content: string;
  keywords: string[];
  source: "kb" | "about";
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { message, transcript } = req.body as {
    message?: string;
    transcript?: ChatMessage[];
  };

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid request" });
  }

  await connect();

  // ✅ Type the lean() results so TS knows fields exist
  const kbArticles = (await KnowledgeBaseArticle.find({ isPublished: true }).lean()) as KbLean[];
  const aboutDoc = (await AboutContent.findOne().lean()) as AboutLean | null;

  const candidates: Candidate[] = [];

  for (const a of kbArticles) {
    candidates.push({
      title: a.title,
      content: a.content,
      keywords: a.keywords || [],
      source: "kb"
    });
  }

  if (aboutDoc) {
    candidates.push({
      title: aboutDoc.title,
      content: aboutDoc.body,
      keywords: [],
      source: "about"
    });
  }

  // Tokenize message into words
  const words = message
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);

  let bestScore = 0;
  let bestCandidate: Candidate | null = null;

  const scored: { candidate: Candidate; score: number }[] = [];

  // ✅ Use for...of so TS narrowing works (prevents "never")
  for (const cand of candidates) {
    const text = (cand.title + " " + cand.keywords.join(" ") + " " + cand.content).toLowerCase();
    let score = 0;

    for (const w of words) {
      if (text.includes(w)) score += 1;
    }

    scored.push({ candidate: cand, score });

    if (score > bestScore) {
      bestScore = score;
      bestCandidate = cand;
    }
  }

  // Suggestions for UI
  const suggestions = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ candidate }) => ({
      title: candidate.title,
      excerpt: candidate.content.substring(0, 160) + (candidate.content.length > 160 ? "…" : "")
    }));

  let answer = "";
  let escalate = false;

  if (!bestCandidate || bestScore === 0) {
    answer = "I'm sorry, I don't have information on that. Would you like to create a support ticket?";
    escalate = true;
  } else {
    answer = `${bestCandidate.content.substring(0, 300)}${
      bestCandidate.content.length > 300 ? "…" : ""
    }`;

    // low confidence if score < 2
    if (bestScore < 2) {
      answer += "\n\nI may not have fully answered your question. Would you like to create a support ticket?";
      escalate = true;
    }
  }

  // Log analytics event for support ask
  try {
    const visitorId = req.cookies["visitorId"] || "unknown";
    const sessionId = req.cookies["sessionId"] || "unknown";
    const deviceType = req.headers["user-agent"]?.toLowerCase().includes("mobile") ? "mobile" : "desktop";

    await (await import("@/lib/models/AnalyticsEvent")).default.create({
      type: "support_ask",
      path: "/contact",
      referrer: req.headers.referer || "",
      visitorId,
      sessionId,
      deviceType,
      meta: { matches: suggestions.length }
    });
  } catch {
    // ignore errors
  }

  return res.status(200).json({ answer, suggestions, escalate });
}
