import Layout from "@/components/Layout";
import { withSessionSsr } from "@/lib/session";
import { useEffect, useState } from "react";
import type { GetServerSidePropsContext } from "next";

interface Summary {
  pageviews: number;
  uniqueVisitors: number;
  sessions: number;
  merchClicks: number;
  supportAsks: number;
  ticketsCreated: number;
  emailsOpened: number;
  range: number;
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [range, setRange] = useState(30);

  const fetchSummary = async (days: number) => {
    const res = await fetch(`/api/admin/analytics/summary?range=${days}`);
    if (res.ok) {
      const data = await res.json();
      setSummary(data);
    }
  };

  useEffect(() => {
    fetchSummary(range);
  }, [range]);

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Analytics</h2>

      <div className="mb-4">
        <label className="mr-2">Range:</label>
        <select
          value={range}
          onChange={(e) => setRange(parseInt(e.target.value, 10))}
          className="p-2 rounded-md text-primary"
        >
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
          <option value={90}>90 days</option>
        </select>
      </div>

      {summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-primary-light p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">Pageviews</h3>
            <p className="text-3xl font-bold text-accent">{summary.pageviews}</p>
          </div>

          <div className="bg-primary-light p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">Unique Visitors</h3>
            <p className="text-3xl font-bold text-accent">{summary.uniqueVisitors}</p>
          </div>

          <div className="bg-primary-light p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">Sessions</h3>
            <p className="text-3xl font-bold text-accent">{summary.sessions}</p>
          </div>

          <div className="bg-primary-light p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">Merch Clicks</h3>
            <p className="text-3xl font-bold text-accent">{summary.merchClicks}</p>
          </div>

          <div className="bg-primary-light p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">Support Asks</h3>
            <p className="text-3xl font-bold text-accent">{summary.supportAsks}</p>
          </div>

          <div className="bg-primary-light p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">Tickets Created</h3>
            <p className="text-3xl font-bold text-accent">{summary.ticketsCreated}</p>
          </div>

          <div className="bg-primary-light p-4 rounded-md shadow-md">
            <h3 className="text-xl font-semibold mb-2">Support Emails Opened</h3>
            <p className="text-3xl font-bold text-accent">{summary.emailsOpened}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  );
}

export const getServerSideProps = withSessionSsr(
  async (context: GetServerSidePropsContext) => {
    const req = context.req as any; // ✅ TS fix for req.session
    const user = req.session?.user;

    if (!user || !user.isAdmin) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    return { props: {} };
  }
);
