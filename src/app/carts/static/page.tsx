import CartListClient from "../components/CartListClient";
import { CartsResponse } from "../components/types";


async function getCarts(): Promise<CartsResponse> {
  const res = await fetch('https://dummyjson.com/carts', {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch carts');
  }

  return res.json();
}

export default async function StaticCartsPage() {
  try {
    const data = await getCarts();
    return <CartListClient initialCarts={data.carts} renderModeText="Static Rendering (ISR 60s)" />;
  } catch (err: any) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        <h2 className="font-bold">Runtime Error Server</h2>
        <p>{err.message || 'Failed to fetch carts'}</p>
      </div>
    );
  }
}