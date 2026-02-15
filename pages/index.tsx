import Layout from "@/components/Layout";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <section className="relative overflow-hidden rounded-2xl border border-brand-line bg-brand-panel">
        <div className="pointer-events-none absolute inset-0 bg-brand-radial opacity-60" />
        <div className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-orange/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-48 right-[-140px] h-[520px] w-[520px] rounded-full bg-brand-orangeLight/15 blur-[120px]" />

        <div className="relative p-8 md:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-black/35 px-3 py-1 text-xs text-white/60">
            <span className="h-2 w-2 rounded-full bg-brand-orange shadow-glow" />
            COMPETITIVE • CONTENT • COMMUNITY
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-black tracking-tight leading-[1.02]">
            BUILT TO COMPETE.
            <br />
            <span className="text-white/70">MADE TO WIN.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-white/65 leading-relaxed">
            TheHatchGGs is an esports organization built on discipline, improvement, and community.
            Tryouts, merch drops, and support that actually responds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/merch" legacyBehavior>
              <a className="rounded-xl bg-brand-orange px-6 py-3 font-extrabold tracking-wide text-black hover:opacity-90 transition text-center shadow-glow">
                SHOP MERCH
              </a>
            </Link>

            <Link href="/about" legacyBehavior>
              <a className="rounded-xl border border-brand-line bg-white/5 px-6 py-3 font-extrabold tracking-wide text-white hover:bg-white/10 transition text-center">
                ABOUT US
              </a>
            </Link>

            <Link href="/contact" legacyBehavior>
              <a className="rounded-xl border border-brand-line px-6 py-3 font-extrabold tracking-wide text-white/85 hover:text-white hover:bg-white/5 transition text-center">
                SUPPORT
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { title: "TEAMS", body: "Tryouts, coaching, and structured improvement." },
          { title: "MERCH", body: "Official store partner. Clean drops, fast access." },
          { title: "SUPPORT", body: "Chat assistant + tickets for anything you need." }
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-brand-line bg-white/5 p-6">
            <div className="text-xs font-extrabold tracking-[0.25em] text-brand-orange">{c.title}</div>
            <div className="mt-3 text-white/70 text-sm leading-relaxed">{c.body}</div>
          </div>
        ))}
      </section>
    </Layout>
  );
}
