import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import MerchItem from '@/lib/models/MerchItem';
import { withSessionRoute } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();
  const user = req.session.user;
  if (!user || !user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method === 'GET') {
    const items = await MerchItem.find().lean();
    return res.status(200).json({ items });
  }
  if (req.method === 'POST') {
    const { name, description, imageUrl, isFeatured, isHidden } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const item = await MerchItem.create({
      name,
      description: description || '',
      imageUrl: imageUrl || '',
      isFeatured: !!isFeatured,
      isHidden: !!isHidden,
    });
    return res.status(201).json({ item });
  }
  return res.status(405).end();
}

export default withSessionRoute(handler);