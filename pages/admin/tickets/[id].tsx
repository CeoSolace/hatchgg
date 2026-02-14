import Layout from "@/components/Layout";
import { withSessionSsr } from "@/lib/session";
import connect from "@/lib/db";
import Ticket from "@/lib/models/Ticket";
import type { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { useRouter } from "next/router";

interface TicketDetailProps {
  ticket: any;
  hasPrivate: boolean;
}

type TicketLean = {
  _id: any;
  name: string;
  email: string;
  subject: string;
  category: string;
  status: string;
  message: string;
  agentTranscript: { role: string; message: string }[];
  internalNotes: { ts: string | Date; note: string }[];
  privateInfoKey?: string | null;
};

export default function TicketDetailPage({ ticket, hasPrivate }: TicketDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(ticket.status);
  const [note, setNote] = useState("");
  const [privateInfo, setPrivateInfo] = useState<string | null>(null);

  const updateStatus = async () => {
    await fetch(`/api/admin/tickets/${ticket._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    router.replace(router.asPath);
  };

  const addNote = async () => {
    if (!note) return;

    await fetch(`/api/admin/tickets/${ticket._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note })
    });

    setNote("");
    router.replace(router.asPath);
  };

  const decryptPrivate = async () => {
    const res = await fetch(`/api/admin/tickets/${ticket._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "decrypt" })
    });

    if (res.ok) {
      const data = await res.json();
      setPrivateInfo(data.privateInfo);
    } else {
      alert("Failed to decrypt");
    }
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-4">Ticket Details</h2>

      <div className="bg-primary-light p-4 rounded-md mb-6">
        <p className="mb-2">
          <strong>Ticket ID:</strong> {ticket._id}
        </p>
        <p className="mb-2">
          <strong>Name:</strong> {ticket.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {ticket.email}
        </p>
        <p className="mb-2">
          <strong>Subject:</strong> {ticket.subject}
        </p>
        <p className="mb-2">
          <strong>Category:</strong> {ticket.category}
        </p>

        <p className="mb-2">
          <strong>Status:</strong>{" "}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-1 rounded-md text-primary"
          >
            <option value="Open">Open</option>
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>

          <button onClick={updateStatus} className="ml-2 text-sm bg-accent px-2 py-1 rounded-md text-white">
            Update
          </button>
        </p>

        <p className="mb-4">
          <strong>Message:</strong> {ticket.message}
        </p>

        {hasPrivate ? (
          <div className="mb-4">
            <p className="font-semibold mb-2">Private Info (encrypted)</p>
            {privateInfo ? (
              <textarea className="w-full p-2 rounded-md text-primary" value={privateInfo} readOnly />
            ) : (
              <button onClick={decryptPrivate} className="bg-accent px-4 py-2 rounded-md text-white">
                Decrypt
              </button>
            )}
          </div>
        ) : null}

        <div className="mb-4">
          <p className="font-semibold mb-2">Transcript:</p>
          <div className="border border-primary-dark p-2 rounded-md max-h-60 overflow-y-auto space-y-1">
            {ticket.agentTranscript.map((msg: any, idx: number) => (
              <div key={idx} className="text-sm">
                <span className="font-bold">{msg.role === "user" ? "User" : "Agent"}:</span> {msg.message}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">Internal Notes</p>
          <ul className="space-y-1 mb-2">
            {ticket.internalNotes.map((n: any, idx: number) => (
              <li key={idx} className="text-sm">
                {new Date(n.ts).toLocaleString()}: {n.note}
              </li>
            ))}
          </ul>

          <div className="flex space-x-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note..."
              className="flex-1 p-2 rounded-md text-primary"
            />
            <button onClick={addNote} className="bg-accent px-3 py-2 rounded-md text-white">
              Add Note
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSessionSsr(async (context: GetServerSidePropsContext) => {
  const { req, params } = context;

  const user = req.session.user;
  if (!user?.isAdmin) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false
      }
    };
  }

  const id = params?.id as string;

  await connect();

  // ✅ Fix: cast lean() result to a single doc shape
  const doc = (await Ticket.findById(id).lean()) as TicketLean | null;

  if (!doc) {
    return { notFound: true };
  }

  const ticket = JSON.parse(JSON.stringify(doc));
  const hasPrivate = !!doc.privateInfoKey;

  return { props: { ticket, hasPrivate } };
});
