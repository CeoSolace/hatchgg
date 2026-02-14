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
    {
      role: "agent",
      message: "Hi! I'm the TheHatchGGs support assistant. How can I help you today?"
    } satisfies ChatMessage
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

    // ✅ keep literal types so role is "user" not string
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
          message: newConversation
            .map((m) => `${m.role === "user" ? "User" : "Support"}: ${m.message}`)
            .join("\n")
        }));

        setPhase("form");
      }
    } catch {
      setConversation((prev) => [...prev, { role: "agent", message: "Sorry, something went wrong." }]);
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

    if (formData.privateInfo) {
      payload.privateInfo = formData.privateInfo;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      setTicketId(data.ticketId);

      if (data.privateInfoKey) {
        setPrivateKey(data.privateInfoKey);
      }

      setPhase("success");
    } else {
      const error = await res.text();
      alert(error);
    }
  };

  return (
    <Layout>
      <section className="max-w-3xl mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Support</h2>

        {phase === "chat" && (
          <>
            <div className="bg-primary-light p-4 rounded-md h-96 overflow-y-auto mb-4 space-y-2">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-md max-w-xs ${
                    msg.role === "user"
                      ? "bg-accent-light text-primary self-end ml-auto"
                      : "bg-accent-dark text-white self-start"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-2 rounded-md text-primary"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button onClick={sendMessage} className="bg-accent px-4 py-2 rounded-md text-white hover:bg-accent-dark">
                Send
              </button>
            </div>
          </>
        )}

        {phase === "form" && (
          <div className="bg-primary-light p-6 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Create a Support Ticket</h3>
            <p className="text-sm mb-4">
              Please fill out the form below to create a ticket. Our team will get back to you via email. Do not include
              passwords or sensitive information.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 rounded-md text-primary"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 rounded-md text-primary"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-2 rounded-md text-primary"
                  value={formData.category}
                  onChange={handleFormChange}
                >
                  <option value="">Select category</option>
                  <option value="Merch & Store">Merch & Store</option>
                  <option value="Teams & Tryouts">Teams & Tryouts</option>
                  <option value="Partnerships">Partnerships</option>
                  <option value="Account / Login">Account / Login</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" htmlFor="subject">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full p-2 rounded-md text-primary"
                  value={formData.subject}
                  onChange={handleFormChange}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full p-2 rounded-md text-primary h-32"
                  value={formData.message}
                  onChange={handleFormChange}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium" htmlFor="privateInfo">
                  Private info (optional)
                </label>
                <textarea
                  id="privateInfo"
                  name="privateInfo"
                  className="w-full p-2 rounded-md text-primary h-20"
                  placeholder="Sensitive information that will be encrypted and only visible to admins"
                  value={formData.privateInfo}
                  onChange={handleFormChange}
                />
              </div>

              <button onClick={submitTicket} className="bg-accent px-4 py-2 rounded-md text-white hover:bg-accent-dark">
                Submit Ticket
              </button>
            </div>
          </div>
        )}

        {phase === "success" && ticketId && (
          <div className="bg-primary-light p-6 rounded-md text-center">
            <h3 className="text-xl font-semibold mb-4">Ticket Created Successfully</h3>
            <p className="mb-2">Your ticket ID is:</p>
            <p className="font-mono text-accent text-lg mb-4">{ticketId}</p>

            {privateKey ? (
              <p className="mb-4 text-xs text-gray-400">Private Info Key: {privateKey} (included in the ticket email template)</p>
            ) : null}

            <p className="mb-4">
              Our team will respond as soon as possible. If you do not hear back within a reasonable time or wish to request
              a copy of your transcript, you may email us using the button below. This will open Gmail compose with a
              prefilled template. Do not change the message contents.
            </p>

            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=support@thehatch.store&su=[TheHatchGGs%20Ticket%20%23${ticketId}]%20${encodeURIComponent(
                formData.subject
              )}&body=${encodeURIComponent(
                `Ticket ID: ${ticketId}\nName: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\n` +
                  (privateKey ? `PRIVATE_INFO_KEY: ${privateKey}\n\n` : "") +
                  "I have not received a response or would like a copy of my transcript.\nPlease assist.\n\nDO NOT CHANGE THIS MESSAGE — it helps us route your ticket correctly."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent px-6 py-3 rounded-md text-white hover:bg-accent-dark"
              onClick={() => {
                fetch("/api/analytics/event", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "contact_gmail_opened",
                    path: "/contact",
                    meta: { ticketId }
                  })
                }).catch(() => {});
              }}
            >
              Email Support
            </a>
          </div>
        )}
      </section>
    </Layout>
  );
}
