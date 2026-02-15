import Layout from "@/components/Layout";
import connect from "@/lib/db";
import AboutContent from "@/lib/models/AboutContent";

interface AboutProps {
  about: {
    title: string;
    body: string;
    heroImageUrl?: string | null;
    updatedAt?: string | null;
  } | null;
}

type AboutLean = {
  title: string;
  body: string;
  heroImageUrl?: string | null;
  updatedAt?: Date;
};

export default function AboutPage({ about }: AboutProps) {
  return (
    <Layout>
      <section className="rounded-2xl border border-brand-line bg-brand-panel overflow-hidden">
        <div className="p-8 md:p-12">
          {about ? (
            <>
              <div className="text-xs font-extrabold tracking-[0.25em] text-brand-orange">ABOUT</div>
              <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">{about.title}</h1>

              {about.heroImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={about.heroImageUrl}
                  alt={about.title}
                  className="mt-8 w-full max-h-[440px] object-cover rounded-2xl border border-brand-line"
                />
              ) : null}

              <div className="mt-8 space-y-5 text-white/75 leading-relaxed">
                {about.body
                  .split("\n")
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
              </div>

              {about.updatedAt ? (
                <div className="mt-8 text-xs text-white/45">
                  Updated: {new Date(about.updatedAt).toLocaleString()}
                </div>
              ) : null}
            </>
          ) : (
            <div className="text-white/70">No about information available yet.</div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  await connect();
  const doc = (await AboutContent.findOne().lean()) as AboutLean | null;

  const about = doc
    ? {
        title: doc.title,
        body: doc.body,
        heroImageUrl: doc.heroImageUrl ?? null,
        updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null
      }
    : null;

  return { props: { about } };
}
