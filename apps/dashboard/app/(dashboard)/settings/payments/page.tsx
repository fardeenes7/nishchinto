import { requireActiveShopContext } from "@/lib/shop-context";
import { PaymentMethodList } from "./PaymentMethodList";

export default async function PaymentsPage() {
    const context = await requireActiveShopContext();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
                <p className="text-muted-foreground">Manage how your customers can pay for their orders.</p>
            </div>

            <PaymentMethodList shopId={context.shopId} />
        </div>
    );
}
