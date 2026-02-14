import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import AboutContent from '@/lib/models/AboutContent';
import { withSessionRoute } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();
  const user = req.session.user;
  if (!user || !user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'GET') {
    const about = await AboutContent.findOne().lean();
    return res.status(200).json({ about });
  }
  if (req.method === 'POST') {
    const { title, body, heroImageUrl } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }
    let doc = await AboutContent.findOne();
    if (!doc) {
      doc = new AboutContent({ title, body, heroImageUrl });
    } else {
      doc.title = title;
      doc.body = body;
      doc.heroImageUrl = heroImageUrl;
      doc.updatedAt = new Date();
    }
    await doc.save();
    return res.status(200).json({ about: doc });
  }
  return res.status(405).end();
}

export default withSessionRoute(handler);