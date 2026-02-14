import Layout from '@/components/Layout';
import { withSessionSsr } from '@/lib/session';
import connect from '@/lib/db';
import AnalyticsEvent from '@/lib/models/AnalyticsEvent';
import Ticket from '@/lib/models/Ticket';
import MerchItem from '@/lib/models/MerchItem';
import AboutContent from '@/lib/models/AboutContent';
import { GetServerSidePropsContext } from 'next';

interface DashboardProps {
  counts: {
    pageviews: number;
    uniqueVisitors: number;
    sessions: number;
    tickets: number;
    merchItems: number;
    publishedArticles: number;
  };
}

export default function AdminDashboard({ counts }: DashboardProps) {
  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-primary-light p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Page Views (30d)</h3>
          <p className="text-3xl font-bold text-accent">{counts.pageviews}</p>
        </div>
        <div className="bg-primary-light p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Unique Visitors (30d)</h3>
          <p className="text-3xl font-bold text-accent">{counts.uniqueVisitors}</p>
        </div>
        <div className="bg-primary-light p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Sessions (30d)</h3>
          <p className="text-3xl font-bold text-accent">{counts.sessions}</p>
        </div>
        <div className="bg-primary-light p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Open Tickets</h3>
          <p className="text-3xl font-bold text-accent">{counts.tickets}</p>
        </div>
        <div className="bg-primary-light p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Merch Items</h3>
          <p className="text-3xl font-bold text-accent">{counts.merchItems}</p>
        </div>
        <div className="bg-primary-light p-4 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-2">Published KB Articles</h3>
          <p className="text-3xl font-bold text-accent">{counts.publishedArticles}</p>
        </div>
      </div>
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
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [pageviews, uniqueVisitorsArr, sessionsArr, openTickets, merchCount, publishedArticles] = await Promise.all([
    AnalyticsEvent.countDocuments({ type: 'pageview', createdAt: { $gte: since } }),
    AnalyticsEvent.distinct('visitorId', { createdAt: { $gte: since } }),
    AnalyticsEvent.distinct('sessionId', { createdAt: { $gte: since } }),
    Ticket.countDocuments({ status: 'Open' }),
    MerchItem.countDocuments({}),
    (await import('@/lib/models/KnowledgeBaseArticle')).default.countDocuments({ isPublished: true }),
  ]);
  return {
    props: {
      counts: {
        pageviews,
        uniqueVisitors: uniqueVisitorsArr.length,
        sessions: sessionsArr.length,
        tickets: openTickets,
        merchItems: merchCount,
        publishedArticles,
      },
    },
  };
});