import "iron-session";
import type { IronSession } from "iron-session";
import type { SessionData } from "@/lib/session";

declare module "iron-session" {
  interface IronSessionData extends SessionData {}
}

// ✅ Add req.session typing for Next (pages router)
declare module "next" {
  interface NextApiRequest {
    session: IronSession<SessionData>;
  }
}

declare module "http" {
  interface IncomingMessage {
    session: IronSession<SessionData>;
  }
}
