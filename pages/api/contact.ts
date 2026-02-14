import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import Ticket from '@/lib/models/Ticket';
import { encryptField } from '@/lib/encryption';
import AnalyticsEvent from '@/lib/models/AnalyticsEvent';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { name, email, subject, category, message, transcript, privateInfo } = req.body;
  if (!name || !email || !subject || !category || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  await connect();
  try {
    const ticketData: any = {
      name,
      email,
      subject,
      category,
      message,
      status: 'Open',
      agentTranscript: Array.isArray(transcript)
        ? transcript.map((m: any) => ({ role: m.role, message: m.message, ts: new Date() }))
        : [],
      agentSummary: '',
      escalationReason: 'user_requested',
    };
    let privateInfoKey: string | undefined;
    if (privateInfo && typeof privateInfo === 'string' && privateInfo.trim().length > 0) {
      const encrypted = encryptField(privateInfo);
      privateInfoKey = randomUUID().slice(0, 8);
      ticketData.privateInfoKey = privateInfoKey;
      ticketData.privateInfoEncrypted = encrypted;
    }
    const newTicket = await Ticket.create(ticketData);
    // log analytics event for ticket created
    try {
      const visitorId = req.cookies['visitorId'] || 'unknown';
      const sessionId = req.cookies['sessionId'] || 'unknown';
      await AnalyticsEvent.create({
        type: 'ticket_created',
        path: req.headers.referer || '/contact',
        referrer: req.headers.referer || '',
        visitorId,
        sessionId,
        deviceType: 'unknown',
        meta: { ticketId: newTicket._id.toString() },
      });
      // also log bot_to_ticket transition
      await AnalyticsEvent.create({
        type: 'bot_to_ticket',
        path: req.headers.referer || '/contact',
        referrer: req.headers.referer || '',
        visitorId,
        sessionId,
        deviceType: 'unknown',
        meta: { ticketId: newTicket._id.toString() },
      });
    } catch (e) {
      // ignore analytics errors
    }
    return res.status(201).json({ ticketId: newTicket._id.toString(), privateInfoKey });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
}