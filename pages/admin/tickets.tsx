import Layout from '@/components/Layout';
import { withSessionSsr } from '@/lib/session';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

interface TicketRow {
  _id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  const fetchTickets = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (statusFilter) params.append('status', statusFilter);
    const res = await fetch('/api/admin/tickets?' + params.toString());
    if (res.ok) {
      const data = await res.json();
      setTickets(data.tickets);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchTickets();
  }, [search, statusFilter]);

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Support Tickets</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="p-2 rounded-md text-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded-md text-primary"
        >
          <option value="">All statuses</option>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-primary-dark">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr
                  key={t._id}
                  className="border-b hover:bg-primary-light cursor-pointer"
                  onClick={() => router.push(`/admin/tickets/${t._id}`)}
                >
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">{t.email}</td>
                  <td className="p-2">{t.subject}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">
                    {new Date(t.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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