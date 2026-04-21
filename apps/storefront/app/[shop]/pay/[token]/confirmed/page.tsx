import Link from "next/link";

interface PayConfirmedPageProps {
  params: Promise<{ shop: string; token: string }>;
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PayConfirmedPage({
  params,
  searchParams,
}: PayConfirmedPageProps) {
  const { shop } = await params;
  const { orderId } = await searchParams;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-xl border bg-card p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Order confirmed</h1>
        <p className="text-muted-foreground mb-4">
          Your Cash on Delivery request has been confirmed.
        </p>
        {orderId ? (
          <p className="text-sm text-muted-foreground mb-6">Order ID: {orderId}</p>
        ) : null}
        <Link
          href={`/${shop}/products`}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
