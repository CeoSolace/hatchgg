import { withSessionRoute } from '@/lib/session';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  req.session.destroy();
  return res.status(200).json({ ok: true });
}

export default withSessionRoute(handler);