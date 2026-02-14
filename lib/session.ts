import type { SessionOptions, IronSession } from "iron-session";
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

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "thehatchggs_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

// API wrapper (keeps req.session.* working)
export function withSessionRoute(handler: NextApiHandler) {
  return async function sessionWrappedHandler(req: any, res: any) {
    const session = (await getIronSession<SessionData>(
      req,
      res,
      sessionOptions
    )) as IronSession<SessionData>;

    req.session = session;
    return handler(req, res);
  };
}

// SSR wrapper (keeps ctx.req.session.* working)
export function withSessionSsr(gssp: GetServerSideProps) {
  return async function sessionWrappedGSSP(ctx: GetServerSidePropsContext) {
    const req: any = ctx.req;
    const res: any = ctx.res;

    const session = (await getIronSession<SessionData>(
      req,
      res,
      sessionOptions
    )) as IronSession<SessionData>;

    req.session = session;
    return gssp(ctx);
  };
}