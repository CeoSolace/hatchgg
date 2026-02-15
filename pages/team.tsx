import Layout from "@/components/Layout";

export default function TeamPage() {
  return (
    <Layout>
      <section className="rounded-2xl border border-brand-line bg-brand-panel p-8 md:p-12">
        <div className="text-xs font-extrabold tracking-[0.25em] text-brand-orange">TEAM</div>
        <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">Roster & Staff</h1>
        <p className="mt-4 text-white/65 max-w-2xl">
          Add your rosters here (game divisions, staff, socials). If you want, I can wire it to your DB model like About/Merch.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["Player One", "Player Two", "Coach", "Manager", "Analyst", "Creator"].map((name) => (
            <div key={name} className="rounded-2xl border border-brand-line bg-white/5 p-5">
              <div className="h-14 w-14 rounded-xl bg-white/5 border border-brand-line" />
              <div className="mt-4 font-bold">{name}</div>
              <div className="mt-1 text-sm text-white/60">Role</div>
              <div className="mt-3 text-xs text-white/50">Add socials + bio here</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
