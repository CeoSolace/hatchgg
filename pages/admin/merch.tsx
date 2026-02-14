import Layout from '@/components/Layout';
import { withSessionSsr } from '@/lib/session';
import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';

interface MerchItem {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isFeatured: boolean;
  isHidden: boolean;
}

export default function AdminMerchPage() {
  const [items, setItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', isFeatured: false, isHidden: false });
  const [message, setMessage] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/merch');
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/admin/merch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', description: '', imageUrl: '', isFeatured: false, isHidden: false });
      setMessage('Item added');
      fetchItems();
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to add item');
    }
  };

  const toggleField = async (id: string, field: 'isFeatured' | 'isHidden', value: boolean) => {
    await fetch(`/api/admin/merch/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete item?')) return;
    await fetch(`/api/admin/merch/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Manage Merchandise</h2>
      {message && <p className="mb-4 text-accent">{message}</p>}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Add New Item</h3>
        <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleFormChange}
              className="w-full p-2 rounded-md text-primary"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleFormChange}
              className="w-full p-2 rounded-md text-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              className="w-full p-2 rounded-md text-primary"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleFormChange}
              />
              <span>Featured</span>
            </label>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isHidden"
                checked={form.isHidden}
                onChange={handleFormChange}
              />
              <span>Hidden</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-accent px-4 py-2 rounded-md text-white hover:bg-accent-dark md:col-span-2"
          >
            Add
          </button>
        </form>
      </div>
      <h3 className="text-xl font-semibold mb-4">Existing Items</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-primary-light p-4 rounded-md shadow-md">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded-md mb-2" />
              )}
              <h4 className="font-semibold mb-1">{item.name}</h4>
              <p className="text-sm mb-2 line-clamp-3">{item.description}</p>
              <div className="flex items-center space-x-2 mb-2">
                <label className="flex items-center space-x-1 text-sm">
                  <input
                    type="checkbox"
                    checked={item.isFeatured}
                    onChange={(e) => toggleField(item._id, 'isFeatured', e.target.checked)}
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-1 text-sm">
                  <input
                    type="checkbox"
                    checked={item.isHidden}
                    onChange={(e) => toggleField(item._id, 'isHidden', e.target.checked)}
                  />
                  <span>Hidden</span>
                </label>
              </div>
              <button
                onClick={() => deleteItem(item._id)}
                className="text-red-500 text-sm underline"
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