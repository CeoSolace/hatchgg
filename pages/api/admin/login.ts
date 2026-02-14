import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/lib/db';
import AdminUser from '@/lib/models/AdminUser';
import { withSessionRoute } from '@/lib/session';
import bcrypt from 'bcryptjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  await connect();
  let admin = await AdminUser.findOne({ email }).exec();
  // If no admin exists at all and credentials match env, create admin
  const envEmail = process.env.ADMIN_SETUP_EMAIL;
  const envPassword = process.env.ADMIN_SETUP_PASSWORD;
  if (!admin) {
    if (envEmail && envPassword && email === envEmail && password === envPassword) {
      const hash = await bcrypt.hash(envPassword, 10);
      admin = await AdminUser.create({ email: envEmail, passwordHash: hash });
    }
  }
  if (!admin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.user = { id: admin._id.toString(), email: admin.email, isAdmin: true };
  await req.session.save();
  return res.status(200).json({ ok: true });
}

export default withSessionRoute(handler);