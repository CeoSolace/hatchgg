import Layout from "@/components/Layout";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-accent/20 via-transparent to-accent-light/10" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Competitive esports org + community
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome to <span className="text-accent">TheHatchGGs</span>
          </h1>

          <p className="mt-4 max-w-2xl text-white/70 leading-relaxed">
            We’re building teams, creating content, and growing a community that cares about improvement and good vibes.
            Explore our merch, learn about us, or reach out for support.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/merch" legacyBehavior>
              <a className="inline-flex justify-center rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark transition-colors">
                Shop Merch
              </a>
            </Link>

            <Link href="/about" legacyBehavior>
              <a className="inline-flex justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors">
                Our Story
              </a>
            </Link>

            <Link href="/contact" legacyBehavior>
              <a className="inline-flex justify-center rounded-xl border border-accent/30 bg-accent/10 px-6 py-3 font-semibold text-white hover:bg-accent/15 transition-colors">
                Contact Support
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Teams & Tryouts", body: "Join a competitive environment with real coaching and structure." },
          { title: "Merch & Store", body: "Support the org and rep the brand via our official store partner." },
          { title: "Support", body: "Questions? Our support assistant can guide you or create a ticket." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p className="mt-2 text-sm text-white/70">{c.body}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
