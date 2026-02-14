import Layout from '@/components/Layout';
import { withSessionSsr } from '@/lib/session';
import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';

interface KBArticle {
  _id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  isPublished: boolean;
}

export default function AdminKnowledgeBasePage() {
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', category: '', content: '', keywords: '', isPublished: false });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/knowledge-base');
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchArticles();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      title: form.title,
      category: form.category,
      content: form.content,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      isPublished: form.isPublished,
    };
    let res;
    if (editingId) {
      res = await fetch(`/api/admin/knowledge-base/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch('/api/admin/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    if (res.ok) {
      setForm({ title: '', category: '', content: '', keywords: '', isPublished: false });
      setEditingId(null);
      setMessage('Saved successfully');
      fetchArticles();
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to save');
    }
  };

  const editArticle = (article: KBArticle) => {
    setEditingId(article._id);
    setForm({
      title: article.title,
      category: article.category,
      content: article.content,
      keywords: article.keywords.join(', '),
      isPublished: article.isPublished,
    });
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    await fetch(`/api/admin/knowledge-base/${id}`, { method: 'DELETE' });
    fetchArticles();
  };

  const togglePublish = async (article: KBArticle) => {
    await fetch(`/api/admin/knowledge-base/${article._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !article.isPublished }),
    });
    fetchArticles();
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Manage Knowledge Base</h2>
      {message && <p className="mb-4 text-accent">{message}</p>}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">{editingId ? 'Edit Article' : 'Add Article'}</h3>
        <form onSubmit={submitArticle} className="space-y-4 max-w-3xl">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleFormChange}
              className="w-full p-2 rounded-md text-primary"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="w-full p-2 rounded-md text-primary"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Keywords (comma separated)</label>
            <input
              name="keywords"
              value={form.keywords}
              onChange={handleFormChange}
              className="w-full p-2 rounded-md text-primary"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Content (markdown supported)</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleFormChange}
              className="w-full p-2 rounded-md text-primary h-40"
              required
            />
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleFormChange}
            />
            <span>Published</span>
          </label>
          <button type="submit" className="bg-accent px-4 py-2 rounded-md text-white hover:bg-accent-dark">
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>
      </div>
      <h3 className="text-xl font-semibold mb-4">Existing Articles</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article._id} className="bg-primary-light p-4 rounded-md shadow-md">
              <h4 className="font-semibold">{article.title}</h4>
              <p className="text-sm mb-2">Category: {article.category}</p>
              <p className="text-sm mb-2">Keywords: {article.keywords.join(', ')}</p>
              <p className="text-sm mb-2">
                Published: {article.isPublished ? 'Yes' : 'No'}{' '}
                <button
                  onClick={() => togglePublish(article)}
                  className="text-accent underline text-xs ml-2"
                >
                  Toggle
                </button>
              </p>
              <button
                onClick={() => editArticle(article)}
                className="text-blue-400 text-sm mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => deleteArticle(article._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
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
  return { props: {} };
});