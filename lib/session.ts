import type { IronSessionOptions, IronSession } from "iron-session";
import { getIronSession } from "iron-session";
import type { GetServerSideProps, GetServerSidePropsContext, NextApiHandler } from "next";

export interface SessionUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

export type SessionData = {
  user?: SessionUser;
};

export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "thehatchggs_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

// Wrap API routes: attach session to req so your existing code still works.
export function withSessionRoute(handler: NextApiHandler) {
  return async function sessionWrappedHandler(req: any, res: any) {
    const session = (await getIronSession<SessionData>(req, res, sessionOptions)) as IronSession<SessionData>;
    req.session = session;
    return handler(req, res);
  };
}

// Wrap SSR: attach session to ctx.req so your existing SSR guards still work.
export function withSessionSsr(gssp: GetServerSideProps) {
  return async function sessionWrappedGSSP(ctx: GetServerSidePropsContext) {
    const req: any = ctx.req;
    const res: any = ctx.res;

    const session = (await getIronSession<SessionData>(req, res, sessionOptions)) as IronSession<SessionData>;
    req.session = session;

    return gssp(ctx);
  };
}
