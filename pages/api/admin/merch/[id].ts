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
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  const item = await MerchItem.findById(id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  if (req.method === 'PUT') {
    const { name, description, imageUrl, isFeatured, isHidden } = req.body;
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (imageUrl !== undefined) item.imageUrl = imageUrl;
    if (isFeatured !== undefined) item.isFeatured = !!isFeatured;
    if (isHidden !== undefined) item.isHidden = !!isHidden;
    item.updatedAt = new Date();
    await item.save();
    return res.status(200).json({ item });
  }
  if (req.method === 'DELETE') {
    await item.deleteOne();
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}

export default withSessionRoute(handler);