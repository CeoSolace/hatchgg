import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";

type NavItem = { href: string; label: string };

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/merch", label: "Merch" },
      { href: "/contact", label: "Support" },
    ],
    []
  );

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-accent via-accent-light to-accent-dark" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-primary/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" legacyBehavior>
                <a className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <span className="font-black text-accent">H</span>
                  </div>
                  <div className="leading-tight">
                    <div className="font-extrabold tracking-tight">TheHatchGGs</div>
                    <div className="text-xs text-white/60">Esports • Community • Merch</div>
                  </div>
                </a>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} legacyBehavior>
                  <a
                    className={[
                      "px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}

              <Link href="/admin" legacyBehavior>
                <a className="ml-2 px-3 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-dark transition-colors">
                  Admin
                </a>
              </Link>
            </nav>

            {/* Mobile button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
              aria-label="Toggle menu"
            >
              <span className="text-xl">{open ? "✕" : "☰"}</span>
            </button>
          </div>

          {/* Mobile nav panel */}
          {open ? (
            <div className="md:hidden pb-4">
              <div className="grid gap-2">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} legacyBehavior>
                    <a
                      onClick={() => setOpen(false)}
                      className={[
                        "px-3 py-2 rounded-lg text-sm border border-white/10",
                        isActive(item.href) ? "bg-white/10" : "bg-white/5 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}

                <Link href="/admin" legacyBehavior>
                  <a
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent-dark transition-colors"
                  >
                    Admin
                  </a>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
      </main>

      <footer className="border-t border-white/10 bg-primary-dark">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="text-sm text-white/70">
            © {year} TheHatchGGs. All rights reserved.
          </div>
          <div className="text-sm text-white/70">
            <span className="text-white/50">Support:</span>{" "}
            <a className="underline hover:text-white" href="mailto:support@thehatch.store">
              support@thehatch.store
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
