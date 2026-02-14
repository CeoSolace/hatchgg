import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import AnalyticsEvent from '@/lib/models/AnalyticsEvent';
import { withSessionRoute } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();
  const user = req.session.user;
  if (!user || !user.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const range = parseInt(req.query.range as string) || 30; // days
  const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000);
  const [pageviews, uniqueVisitors, sessions, merchClicks, supportAsks, ticketsCreated, emailsOpened] =
    await Promise.all([
      AnalyticsEvent.countDocuments({ type: 'pageview', createdAt: { $gte: since } }),
      AnalyticsEvent.distinct('visitorId', { createdAt: { $gte: since } }).then((arr) => arr.length),
      AnalyticsEvent.distinct('sessionId', { createdAt: { $gte: since } }).then((arr) => arr.length),
      AnalyticsEvent.countDocuments({ type: 'click', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ type: 'support_ask', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ type: 'ticket_created', createdAt: { $gte: since } }),
      AnalyticsEvent.countDocuments({ type: 'contact_gmail_opened', createdAt: { $gte: since } }),
    ]);
  return res.status(200).json({
    pageviews,
    uniqueVisitors,
    sessions,
    merchClicks,
    supportAsks,
    ticketsCreated,
    emailsOpened,
    range,
  });
}

export default withSessionRoute(handler);