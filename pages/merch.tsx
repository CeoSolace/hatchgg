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
};

export default function MerchPage({ items }: MerchProps) {
  const featured = items.filter((i) => i.isFeatured);
  const rest = items.filter((i) => !i.isFeatured);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Merchandise</h2>
          <p className="mt-2 text-white/70 max-w-2xl">
            Explore our official merch. Purchases redirect to our partner store.
          </p>
        </div>

        <a
          href="https://imprev.store/team/hatch"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex justify-center rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark transition-colors"
          onClick={() => {
            fetch("/api/analytics/event", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "click", path: "/merch", meta: { buttonId: "visit-store" } }),
            }).catch(() => {});
          }}
        >
          Visit Official Store
        </a>
      </div>

      {featured.length ? (
        <section className="mt-8">
          <h3 className="text-lg font-bold text-white/90 mb-3">Featured</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((item) => (
              <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="w-full h-56 object-cover" />
                ) : null}
                <div className="p-6">
                  <div className="inline-flex text-xs px-2 py-1 rounded-full bg-accent/15 border border-accent/20 text-white/80">
                    Featured
                  </div>
                  <h4 className="mt-3 text-xl font-bold">{item.name}</h4>
                  <p className="mt-2 text-sm text-white/70">{item.description}</p>
                  <a
                    href="https://imprev.store/team/hatch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex justify-center w-full rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h3 className="text-lg font-bold text-white/90 mb-3">All Items</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((item) => (
            <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="w-full h-44 object-cover rounded-xl" />
              ) : null}
              <h4 className="mt-4 text-lg font-bold">{item.name}</h4>
              <p className="mt-2 text-sm text-white/70 flex-1">{item.description}</p>
              <a
                href="https://imprev.store/team/hatch"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex justify-center rounded-xl border border-accent/30 bg-accent/10 px-5 py-3 font-semibold text-white hover:bg-accent/15 transition-colors"
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
  const docs = (await MerchItem.find({ isHidden: { $ne: true } }).lean()) as MerchLean[];

  const items = docs.map((doc) => ({
    _id: typeof doc._id === "string" ? doc._id : doc._id.toString(),
    name: doc.name,
    description: doc.description,
    imageUrl: doc.imageUrl ?? null,
    isFeatured: doc.isFeatured,
  }));

  return { props: { items } };
};
