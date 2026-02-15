import Layout from "@/components/Layout";
import { useState } from "react";

interface ChatMessage {
  role: "user" | "agent";
  message: string;
}

interface SupportResponse {
  answer: string;
  suggestions: { title: string; excerpt: string }[];
  escalate: boolean;
}

export default function ContactPage() {
  const [conversation, setConversation] = useState<ChatMessage[]>([
    { role: "agent", message: "Hatch Support here. What can I help you with?" }
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"chat" | "form" | "success">("chat");
  const [ticketId, setTicketId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    privateInfo: ""
  });

  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { role: "user", message: trimmed };
    const newConversation: ChatMessage[] = [...conversation, userMsg];

    setConversation(newConversation);
    setInput("");

    try {
      const res = await fetch("/api/support/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, transcript: newConversation })
      });

      const data: SupportResponse = await res.json();
      setConversation((prev) => [...prev, { role: "agent", message: data.answer }]);

      if (data.escalate) {
        setFormData((f) => ({
          ...f,
          subject: trimmed.slice(0, 60),
          message: newConversation.map((m) => `${m.role}: ${m.message}`).join("\n")
        }));
        setPhase("form");
      }
    } catch {
      setConversation((prev) => [...prev, { role: "agent", message: "Something broke. Try again." }]);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitTicket = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.category || !formData.message) {
      alert("Please fill all required fields.");
      return;
    }

    const payload: any = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      category: formData.category,
      message: formData.message,
      transcript: conversation
    };
    if (formData.privateInfo) payload.privateInfo = formData.privateInfo;

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      setTicketId(data.ticketId);
      if (data.privateInfoKey) setPrivateKey(data.privateInfoKey);
      setPhase("success");
    } else {
      alert(await res.text());
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHAT */}
        <div className="rounded-2xl border border-brand-line bg-brand-panel overflow-hidden">
          <div className="p-6 border-b border-brand-line">
            <div className="text-xs font-extrabold tracking-[0.25em] text-brand-orange">SUPPORT</div>
            <h1 className="mt-3 text-2xl md:text-4xl font-black tracking-tight">Chat</h1>
            <p className="mt-2 text-sm text-white/60">
              Ask here first. If we can’t answer, we’ll prep a ticket.
            </p>
          </div>

          {phase === "chat" ? (
            <>
              <div className="p-4 h-[420px] overflow-y-auto space-y-3">
                {conversation.map((m, idx) => (
                  <div
                    key={idx}
                    className={[
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap border",
                      m.role === "user"
                        ? "ml-auto bg-brand-orange/10 border-brand-orange/25"
                        : "mr-auto bg-white/5 border-brand-line"
                    ].join(" ")}
                  >
                    {m.message}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-brand-line flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message…"
                  className="flex-1 rounded-xl border border-brand-line bg-black/40 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                />
                <button
                  onClick={sendMessage}
                  className="rounded-xl bg-brand-orange px-5 py-3 font-extrabold tracking-wide text-black hover:opacity-90 transition"
                >
                  SEND
                </button>
              </div>
            </>
          ) : phase === "success" && ticketId ? (
            <div className="p-6">
              <div className="text-white/60 text-sm">Ticket created</div>
              <div className="mt-2 font-mono text-2xl text-brand-orange">{ticketId}</div>
              {privateKey ? (
                <div className="mt-2 text-xs text-white/50">
                  Private key: <span className="font-mono">{privateKey}</span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="p-6 text-white/60">Ticket form is ready on the right →</div>
          )}
        </div>

        {/* FORM */}
        <div className="rounded-2xl border border-brand-line bg-brand-panel overflow-hidden">
          <div className="p-6 border-b border-brand-line">
            <div className="text-xs font-extrabold tracking-[0.25em] text-brand-orange">TICKET</div>
            <h2 className="mt-3 text-xl font-black tracking-tight">Create a ticket</h2>
            <p className="mt-2 text-sm text-white/60">No passwords. Private info is encrypted.</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-brand-line bg-black/40 px-4 py-3 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-white/50">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-xl border border-brand-line bg-black/40 px-4 py-3 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-xl border border-brand-line bg-black/40 px-4 py-3 text-white"
              >
                <option value="">Select</option>
                <option value="Merch & Store">Merch & Store</option>
                <option value="Teams & Tryouts">Teams & Tryouts</option>
                <option value="Partnerships">Partnerships</option>
                <option value="Account / Login">Account / Login</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-white/50">Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleFormChange}
                className="mt-1 w-full rounded-xl border border-brand-line bg-black/40 px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-white/50">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                className="mt-1 w-full h-32 rounded-xl border border-brand-line bg-black/40 px-4 py-3 text-white"
              />
            </div>

            <div>
              <label className="text-xs text-white/50">Private info (optional)</label>
              <textarea
                name="privateInfo"
                value={formData.privateInfo}
                onChange={handleFormChange}
                placeholder="Encrypted — admin only"
                className="mt-1 w-full h-24 rounded-xl border border-brand-line bg-black/40 px-4 py-3 text-white placeholder:text-white/40"
              />
            </div>

            <button
              onClick={submitTicket}
              className="w-full rounded-xl bg-brand-orange px-6 py-3 font-extrabold tracking-wide text-black hover:opacity-90 transition shadow-glow"
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
