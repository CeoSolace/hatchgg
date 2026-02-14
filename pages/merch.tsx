import Layout from "@/components/Layout";
import connect from "@/lib/db";
import MerchItem from "@/lib/models/MerchItem";
import type { GetServerSideProps } from "next";

interface MerchProps {
  items: {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string | null;
    isFeatured: boolean;
  }[];
}

type MerchLean = {
  _id: { toString(): string } | string;
  name: string;
  description: string;
  imageUrl?: string | null;
  isFeatured: boolean;
  isHidden?: boolean;
};

export default function MerchPage({ items }: MerchProps) {
  return (
    <Layout>
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Merchandise</h2>

        <div className="max-w-5xl mx-auto mb-4">
          <p className="text-center mb-4">
            Explore our official merchandise! All purchases redirect to our partner store.
          </p>

          <div className="text-center">
            <a
              href="https://imprev.store/team/hatch"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent px-6 py-3 rounded-md text-white hover:bg-accent-dark transition-colors mb-8"
              onClick={() => {
                fetch("/api/analytics/event", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: "click", path: "/merch", meta: { buttonId: "visit-store" } })
                }).catch(() => {});
              }}
            >
              Visit Official Store
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-primary-light rounded-lg p-4 shadow-md flex flex-col justify-between"
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              ) : null}

              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="flex-1 mb-4 text-sm text-gray-300">{item.description}</p>

              <a
                href="https://imprev.store/team/hatch"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent px-4 py-2 text-center rounded-md text-white hover:bg-accent-dark"
                onClick={() => {
                  fetch("/api/analytics/event", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "click", path: "/merch", meta: { buttonId: "buy-merch" } })
                  }).catch(() => {});
                }}
              >
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<MerchProps> = async () => {
  await connect();

  // ✅ Fix: type lean() docs so _id is not unknown
  const docs = (await MerchItem.find({ isHidden: { $ne: true } }).lean()) as MerchLean[];

  const items = docs.map((doc) => ({
    _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
    name: doc.name,
    description: doc.description,
    imageUrl: doc.imageUrl ?? null,
    isFeatured: doc.isFeatured
  }));

  return { props: { items } };
};
