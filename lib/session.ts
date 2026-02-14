import type { SessionOptions, IronSession } from "iron-session";
import { getIronSession } from "iron-session";
import type { GetServerSideProps, GetServerSidePropsContext, NextApiHandler, NextApiRequest, NextApiResponse } from "next";

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
    sameSite: "lax"
  }
};

// ✅ API wrapper
export function withSessionRoute(handler: NextApiHandler) {
  return async function sessionWrappedHandler(req: NextApiRequest, res: NextApiResponse) {
    req.session = (await getIronSession<SessionData>(req, res, sessionOptions)) as IronSession<SessionData>;
    return handler(req, res);
  };
}

// ✅ SSR wrapper
export function withSessionSsr<P extends { [key: string]: any } = { [key: string]: any }>(
  gssp: GetServerSideProps<P>
): GetServerSideProps<P> {
  return async function sessionWrappedGSSP(ctx: GetServerSidePropsContext) {
    ctx.req.session = (await getIronSession<SessionData>(ctx.req, ctx.res, sessionOptions)) as IronSession<SessionData>;
    return gssp(ctx);
  };
}
