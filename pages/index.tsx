import Layout from "@/components/Layout";
import Link from "next/link";

export default function HomePage() {
  return (
    <Layout>
      <section className="text-center py-20">
        <h2 className="text-4xl font-bold mb-4">Welcome to TheHatchGGs</h2>

        <p className="max-w-xl mx-auto mb-8">
          We are a competitive esports organization striving for greatness. Discover our story, support our journey, and
          join our community.
        </p>

        <div className="space-x-4">
          <Link href="/merch" legacyBehavior>
            <a className="bg-accent text-white px-6 py-3 rounded-md hover:bg-accent-dark transition-colors">
              Shop Merch
            </a>
          </Link>

          <Link href="/contact" legacyBehavior>
            <a className="bg-accent-light text-primary px-6 py-3 rounded-md hover:bg-accent transition-colors">
              Contact Us
            </a>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
