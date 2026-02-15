import Link from "next/link";
import React, { useState } from "react";

const NAV = [
  { href: "/about", label: "ABOUT US" },
  { href: "/team", label: "TEAM" },
  { href: "/merch", label: "SHOP" },
  { href: "/contact", label: "SUPPORT" }
];

const SOCIAL = [
  { href: "https://discord.com", label: "DISCORD" },
  { href: "https://twitter.com", label: "X" },
  { href: "https://tiktok.com", label: "TIKTOK" },
  { href: "https://twitch.tv", label: "TWITCH" }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      {/* top orange line */}
      <div className="h-[2px] bg-brand-orange" />

      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur border-b border-brand-line">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 flex items-center justify-between relative">
            {/* left nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV.map((i) => (
                <Link key={i.href} href={i.href} legacyBehavior>
                  <a className="text-xs font-extrabold tracking-[0.24em] text-brand-steel hover:text-white transition">
                    {i.label}
                  </a>
                </Link>
              ))}
            </nav>

            {/* mobile menu button */}
            <button
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-brand-line bg-white/5 hover:bg-white/10 transition"
              onClick={() => setOpen((v) => !v)}
              aria-label="Open menu"
            >
              <span className="text-xl">{open ? "✕" : "☰"}</span>
            </button>

            {/* center logo */}
            <Link href="/" legacyBehavior>
              <a className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 select-none">
                <div className="relative w-10 h-10 rounded-xl bg-white/5 border border-brand-line overflow-hidden">
                  <div className="absolute inset-0 bg-brand-gradient opacity-70" />
                  <div className="relative grid place-items-center h-full w-full font-black tracking-tight">
                    H
                  </div>
                </div>

                <div className="hidden sm:block leading-none">
                  <div className="font-black tracking-tight">
                    TheHatch<span className="text-brand-orange">GGs</span>
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.32em] text-white/45">
                    ESPORTS • COMMUNITY
                  </div>
                </div>
              </a>
            </Link>

            {/* right social */}
            <div className="hidden md:flex items-center gap-5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-white/55 hover:text-brand-orange transition"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* mobile menu */}
          {open ? (
            <div className="md:hidden pb-4">
              <div className="mt-2 grid gap-2">
                {NAV.map((i) => (
                  <Link key={i.href} href={i.href} legacyBehavior>
                    <a
                      onClick={() => setOpen(false)}
                      className="rounded-xl border border-brand-line bg-white/5 px-4 py-3 text-sm font-semibold tracking-wide hover:bg-white/10 transition"
                    >
                      {i.label}
                    </a>
                  </Link>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-brand-line bg-black/40 px-3 py-2 text-xs font-semibold text-white/60 hover:text-brand-orange transition"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">{children}</main>

      <footer className="border-t border-brand-line bg-black/60">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm text-white/55">
            © {new Date().getFullYear()} TheHatchGGs
          </div>
          <div className="text-sm text-white/55">
            Support:{" "}
            <a className="text-white hover:text-brand-orange transition" href="mailto:support@thehatch.store">
              support@thehatch.store
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
