import Layout from '@/components/Layout';
import { withSessionSsr } from '@/lib/session';
import connect from '@/lib/db';
import AboutContent from '@/lib/models/AboutContent';
import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';

interface AboutAdminProps {
  about: {
    title: string;
    body: string;
    heroImageUrl?: string;
  } | null;
}

export default function AdminAboutPage({ about }: AboutAdminProps) {
  const [form, setForm] = useState({
    title: about?.title || '',
    body: about?.body || '',
    heroImageUrl: about?.heroImageUrl || '',
  });
  const [message, setMessage] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/admin/about', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('About page updated successfully.');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to update.');
    }
  };
  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Edit About Page</h2>
      {message && <p className="mb-4 text-accent">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-primary"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="body">
            Body (markdown supported)
          </label>
          <textarea
            id="body"
            name="body"
            value={form.body}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-primary h-64"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium" htmlFor="heroImageUrl">
            Hero Image URL (optional)
          </label>
          <input
            id="heroImageUrl"
            name="heroImageUrl"
            type="text"
            value={form.heroImageUrl}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-primary"
          />
        </div>
        <button type="submit" className="bg-accent px-4 py-2 rounded-md text-white hover:bg-accent-dark">
          Save
        </button>
      </form>
    </Layout>
  );
}

export const getServerSideProps = withSessionSsr(async (context: GetServerSidePropsContext) => {
  const { req } = context;
  const user = req.session.user;
  if (!user || !user.isAdmin) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
  await connect();
  const doc = await AboutContent.findOne().lean();
  const about = doc
    ? { title: doc.title, body: doc.body, heroImageUrl: doc.heroImageUrl || null }
    : null;
  return { props: { about } };
});