import Layout from '@/components/Layout';
import connect from '@/lib/db';
import AboutContent from '@/lib/models/AboutContent';
import { GetServerSidePropsContext } from 'next';

interface AboutProps {
  about: {
    title: string;
    body: string;
    heroImageUrl?: string;
    updatedAt?: string;
  } | null;
}

export default function AboutPage({ about }: AboutProps) {
  return (
    <Layout>
      <section className="max-w-3xl mx-auto py-8">
        {about ? (
          <>
            <h2 className="text-3xl font-bold mb-4">{about.title}</h2>
            {about.heroImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about.heroImageUrl}
                alt={about.title}
                className="mb-4 w-full rounded-lg"
              />
            )}
            <div className="prose prose-invert">
              {about.body.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </>
        ) : (
          <p>No about information available yet.</p>
        )}
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  await connect();
  const aboutDoc = await AboutContent.findOne().lean();
  const about = aboutDoc
    ? {
        title: aboutDoc.title,
        body: aboutDoc.body,
        heroImageUrl: aboutDoc.heroImageUrl || null,
        updatedAt: aboutDoc.updatedAt ? aboutDoc.updatedAt.toISOString() : null,
      }
    : null;
  return {
    props: {
      about,
    },
  };
}