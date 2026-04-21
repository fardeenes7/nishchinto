import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import {
  confirmStorefrontPaymentInvoiceCod,
  getStorefrontPaymentInvoice,
  getStorefrontShop,
} from "@repo/api";

interface PayTokenPageProps {
  params: Promise<{ shop: string; token: string }>;
}

function formatPrice(price: string, currency: string = "BDT") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(parseFloat(price));
}

export default async function PayTokenPage({ params }: PayTokenPageProps) {
  const { shop, token } = await params;

  const [invoiceRes, shopRes] = await Promise.all([
    getStorefrontPaymentInvoice(shop, token),
    getStorefrontShop(shop),
  ]);

  if (!invoiceRes.success) {
    if (invoiceRes.status === 404) notFound();
    if (invoiceRes.status === 410) {
      return (
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-xl border bg-card p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Payment link unavailable</h1>
            <p className="text-muted-foreground mb-6">
              This payment link is expired or already used.
            </p>
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

    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-xl border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Unable to load payment page</h1>
          <p className="text-muted-foreground">Please try again in a moment.</p>
        </div>
      </main>
    );
  }

  const invoice = invoiceRes.data;
  const order = invoice.order;
  const currency = shopRes.success ? shopRes.data.base_currency : order.currency;
  const shopName = shopRes.success ? shopRes.data.name : shop;

  async function confirmCodAction() {
    "use server";

    const confirmRes = await confirmStorefrontPaymentInvoiceCod(shop, token);
    if (!confirmRes.success) {
      if (confirmRes.status === 410) {
        redirect(`/${shop}/pay/${token}`);
      }
      redirect(`/${shop}/pay/${token}`);
    }

    redirect(`/${shop}/pay/${token}/confirmed?orderId=${confirmRes.data.order_id}`);
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto rounded-xl border bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Pay order</h1>
        <p className="text-muted-foreground mt-1">{shopName}</p>

        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="rounded-lg border divide-y">
            {order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  {item.variant_summary ? (
                    <p className="text-sm text-muted-foreground">{item.variant_summary}</p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(item.line_total_amount, currency)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal_amount, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(order.shipping_amount, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>-{formatPrice(order.discount_amount, currency)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total_amount, currency)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <form action={confirmCodAction}>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-primary-foreground font-medium"
            >
              Confirm Cash on Delivery
            </button>
          </form>

          <button
            type="button"
            disabled
            className="w-full inline-flex items-center justify-center rounded-md border px-4 py-3 text-muted-foreground cursor-not-allowed"
          >
            Pay Online (Coming in v0.8)
          </button>
        </div>
      </div>
    </main>
  );
}
