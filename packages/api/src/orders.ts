import { publicFetch, type ApiResponse } from "./fetcher";

export interface PaymentMethodOption {
  code: "COD" | "ONLINE";
  label: string;
  enabled: boolean;
}

export interface StorefrontPaymentInvoiceItem {
  id: string;
  product_name: string;
  variant_summary: string;
  quantity: number;
  unit_price: string;
  line_discount_amount: string;
  line_total_amount: string;
}

export interface StorefrontPaymentInvoiceOrder {
  id: string;
  status: string;
  subtotal_amount: string;
  shipping_amount: string;
  discount_amount: string;
  total_amount: string;
  currency: string;
  items: StorefrontPaymentInvoiceItem[];
}

export interface StorefrontPaymentInvoice {
  token: string;
  expires_at: string;
  is_used: boolean;
  order: StorefrontPaymentInvoiceOrder;
  payment_methods: PaymentMethodOption[];
}

export interface StorefrontPaymentInvoiceConfirmResult {
  order_id: string;
  order_status: string;
  invoice_token: string;
}

export async function getStorefrontPaymentInvoice(
  shopSlug: string,
  token: string,
): Promise<ApiResponse<StorefrontPaymentInvoice>> {
  return publicFetch<StorefrontPaymentInvoice>(
    `/api/v1/storefront/${shopSlug}/pay/${token}/`,
    { cache: "no-store" },
  );
}

export async function confirmStorefrontPaymentInvoiceCod(
  shopSlug: string,
  token: string,
): Promise<ApiResponse<StorefrontPaymentInvoiceConfirmResult>> {
  return publicFetch<StorefrontPaymentInvoiceConfirmResult>(
    `/api/v1/storefront/${shopSlug}/pay/${token}/cod-confirm/`,
    {
      method: "POST",
      cache: "no-store",
    },
  );
}
