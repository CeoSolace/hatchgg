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
          <div className="text-xs font-extrabold tracking-[0.25em] text-brand-orange">SHOP</div>
          <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">Merch</h1>
          <p className="mt-3 text-white/65 max-w-2xl">
            Official merchandise. Purchases redirect to our partner store.
          </p>
        </div>

        <a
          href="https://imprev.store/team/hatch"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-brand-orange px-6 py-3 font-extrabold tracking-wide text-black hover:opacity-90 transition text-center shadow-glow"
        >
          VISIT STORE
        </a>
      </div>

      {featured.length ? (
        <section className="mt-10">
          <h2 className="text-xs font-extrabold tracking-[0.25em] text-white/60">FEATURED</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {featured.map((item) => (
              <div key={item._id} className="rounded-2xl border border-brand-line bg-white/5 overflow-hidden">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover" />
                ) : null}
                <div className="p-6">
                  <div className="text-xl font-bold">{item.name}</div>
                  <div className="mt-2 text-sm text-white/65">{item.description}</div>
                  <a
                    href="https://imprev.store/team/hatch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full justify-center rounded-xl border border-brand-line bg-black/30 px-5 py-3 font-extrabold tracking-wide text-white hover:bg-white/10 transition"
                  >
                    BUY NOW
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xs font-extrabold tracking-[0.25em] text-white/60">ALL ITEMS</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item) => (
            <div key={item._id} className="rounded-2xl border border-brand-line bg-white/5 overflow-hidden">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} className="w-full h-44 object-cover" />
              ) : (
                <div className="h-44 bg-black/30" />
              )}

              <div className="p-5">
                <div className="font-bold">{item.name}</div>
                <div className="mt-2 text-sm text-white/65">{item.description}</div>

                <a
                  href="https://imprev.store/team/hatch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full justify-center rounded-xl bg-brand-orange px-5 py-3 font-extrabold tracking-wide text-black hover:opacity-90 transition"
                >
                  VIEW IN STORE
                </a>
              </div>
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
    isFeatured: doc.isFeatured
  }));

  return { props: { items } };
};
