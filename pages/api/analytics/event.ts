import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import AnalyticsEvent from '@/lib/models/AnalyticsEvent';

function detectDeviceType(userAgent: string | undefined): string {
  if (!userAgent) return 'unknown';
  const ua = userAgent.toLowerCase();
  if (/mobile|iphone|android/.test(ua)) return 'mobile';
  if (/tablet|ipad/.test(ua)) return 'tablet';
  return 'desktop';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { type, path, referrer, meta } = req.body;
  if (!type || !path) {
    return res.status(400).json({ error: 'Invalid event payload' });
  }
  await connect();
  try {
    const visitorId = req.cookies['visitorId'] || 'unknown';
    const sessionId = req.cookies['sessionId'] || 'unknown';
    const deviceType = detectDeviceType(req.headers['user-agent']);
    await AnalyticsEvent.create({
      type,
      path,
      referrer: referrer || '',
      visitorId,
      sessionId,
      deviceType,
      meta: meta || {},
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to log event' });
  }
}