import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import Ticket from '@/lib/models/Ticket';
import { withSessionRoute } from '@/lib/session';
import { decryptField } from '@/lib/encryption';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();
  const user = req.session.user;
  if (!user || !user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  const ticket = await Ticket.findById(id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  if (req.method === 'GET') {
    // send ticket details excluding encrypted field
    const plain = ticket.toObject();
    delete plain.privateInfoEncrypted;
    return res.status(200).json({ ticket: plain });
  }
  if (req.method === 'PATCH') {
    const { status, note, decrypt } = req.body;
    if (status && ['Open', 'Pending', 'Closed'].includes(status)) {
      ticket.status = status;
    }
    if (note && typeof note === 'string') {
      ticket.internalNotes.push({ ts: new Date(), note, adminUser: user.id });
    }
    await ticket.save();
    return res.status(200).json({ ticket });
  }
  if (req.method === 'POST') {
    // decrypt private info
    const { action } = req.body;
    if (action === 'decrypt') {
      if (ticket.privateInfoEncrypted) {
        try {
          const decrypted = decryptField(ticket.privateInfoEncrypted as any);
          return res.status(200).json({ privateInfo: decrypted });
        } catch (e) {
          return res.status(500).json({ error: 'Failed to decrypt' });
        }
      }
      return res.status(404).json({ error: 'No private info' });
    }
  }
  return res.status(405).end();
}

export default withSessionRoute(handler);