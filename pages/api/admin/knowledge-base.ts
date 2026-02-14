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
  if (req.method === 'GET') {
    const articles = await KnowledgeBaseArticle.find().lean();
    return res.status(200).json({ articles });
  }
  if (req.method === 'POST') {
    const { title, category, content, keywords, isPublished } = req.body;
    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category and content are required' });
    }
    const article = await KnowledgeBaseArticle.create({
      title,
      category,
      content,
      keywords: Array.isArray(keywords) ? keywords : [],
      isPublished: !!isPublished,
    });
    return res.status(201).json({ article });
  }
  return res.status(405).end();
}

export default withSessionRoute(handler);