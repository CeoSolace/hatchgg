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
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        {about ? (
          <>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{about.title}</h2>

            {about.heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about.heroImageUrl}
                alt={about.title}
                className="mt-6 w-full max-h-[420px] object-cover rounded-2xl border border-white/10"
              />
            ) : null}

            <div className="mt-6 space-y-4 text-white/80 leading-relaxed">
              {about.body.split("\n").filter(Boolean).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {about.updatedAt ? (
              <p className="mt-6 text-xs text-white/50">
                Updated: {new Date(about.updatedAt).toLocaleString()}
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-white/70">No about information available yet.</p>
        )}
      </div>
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
        updatedAt: doc.updatedAt ? doc.updatedAt.toISOString() : null,
      }
    : null;

  return { props: { about } };
}
