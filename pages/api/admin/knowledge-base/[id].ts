import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import KnowledgeBaseArticle from '@/lib/models/KnowledgeBaseArticle';
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
  const article = await KnowledgeBaseArticle.findById(id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  if (req.method === 'GET') {
    return res.status(200).json({ article });
  }
  if (req.method === 'PUT') {
    const { title, category, content, keywords, isPublished } = req.body;
    if (title !== undefined) article.title = title;
    if (category !== undefined) article.category = category;
    if (content !== undefined) article.content = content;
    if (keywords !== undefined) article.keywords = Array.isArray(keywords) ? keywords : [];
    if (isPublished !== undefined) article.isPublished = !!isPublished;
    article.updatedAt = new Date();
    await article.save();
    return res.status(200).json({ article });
  }
  if (req.method === 'DELETE') {
    await article.deleteOne();
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}

export default withSessionRoute(handler);