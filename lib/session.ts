import type { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

export interface SessionUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'thehatchggs_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

// These helpers wrap API and SSR handlers with the session options configured above.
export function withSessionRoute(handler: any) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler: any) {
  return withIronSessionSsr(handler, sessionOptions);
}