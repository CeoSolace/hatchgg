import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import Ticket from '@/lib/models/Ticket';
import { withSessionRoute } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();
  const user = req.session.user;
  if (!user || !user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'GET') {
    const { status, search } = req.query;
    const filter: any = {};
    if (status && typeof status === 'string' && ['Open', 'Pending', 'Closed'].includes(status)) {
      filter.status = status;
    }
    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }
    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.status(200).json({ tickets });
  }
  return res.status(405).end();
}

export default withSessionRoute(handler);