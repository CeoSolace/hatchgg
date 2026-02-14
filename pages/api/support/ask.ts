import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import KnowledgeBaseArticle from '@/lib/models/KnowledgeBaseArticle';
import AboutContent from '@/lib/models/AboutContent';

interface ChatMessage {
  role: 'user' | 'agent';
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { message, transcript } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid request' });
  }
  await connect();
  // Fetch published knowledge base articles and about page.
  const kbArticles = await KnowledgeBaseArticle.find({ isPublished: true }).lean();
  const aboutDoc = await AboutContent.findOne().lean();
  // Build candidates array with documents and content.
  type Candidate = {
    title: string;
    content: string;
    keywords: string[];
    source: string;
  };
  const candidates: Candidate[] = [];
  kbArticles.forEach((a) => {
    candidates.push({
      title: a.title,
      content: a.content,
      keywords: a.keywords || [],
      source: 'kb',
    });
  });
  if (aboutDoc) {
    candidates.push({
      title: aboutDoc.title,
      content: aboutDoc.body,
      keywords: [],
      source: 'about',
    });
  }
  // Tokenize message into words
  const words = message
    .toLowerCase()
    .split(/\W+/)
    .filter((w: string) => w.length > 2);
  let bestScore = 0;
  let bestCandidate: Candidate | null = null;
  const scored: { candidate: Candidate; score: number }[] = [];
  candidates.forEach((cand) => {
    const text = (cand.title + ' ' + cand.keywords.join(' ') + ' ' + cand.content).toLowerCase();
    let score = 0;
    words.forEach((w) => {
      if (text.includes(w)) {
        score += 1;
      }
    });
    scored.push({ candidate: cand, score });
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = cand;
    }
  });
  // Sort for suggestions
  const suggestions = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ candidate }) => ({
      title: candidate.title,
      excerpt: candidate.content.substring(0, 160) + (candidate.content.length > 160 ? '…' : ''),
    }));
  let answer = '';
  let escalate = false;
  if (!bestCandidate || bestScore === 0) {
    answer =
      "I'm sorry, I don't have information on that. Would you like to create a support ticket?";
    escalate = true;
  } else {
    // derive answer from candidate content
    answer = `${bestCandidate.content.substring(0, 300)}${
      bestCandidate.content.length > 300 ? '…' : ''
    }`;
    // low confidence if score < 2
    if (bestScore < 2) {
      answer += '\n\nI may not have fully answered your question. Would you like to create a support ticket?';
      escalate = true;
    }
  }
  // Log analytics event for support ask
  try {
    const visitorId = req.cookies['visitorId'] || 'unknown';
    const sessionId = req.cookies['sessionId'] || 'unknown';
    const deviceType = req.headers['user-agent']?.toLowerCase().includes('mobile') ? 'mobile' : 'desktop';
    await (await import('@/lib/models/AnalyticsEvent')).default.create({
      type: 'support_ask',
      path: '/contact',
      referrer: req.headers.referer || '',
      visitorId,
      sessionId,
      deviceType,
      meta: { matches: suggestions.length },
    });
  } catch (e) {
    // ignore errors
  }
  return res.status(200).json({ answer, suggestions, escalate });
}