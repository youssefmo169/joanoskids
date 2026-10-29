/**
 * orderService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for every order submission in the app.
 * Both CheckoutPage and QuickCheckoutModal call submitOrder() — nothing else
 * touches the `orders` or `order_items` tables directly.
 *
 * DB schema (source of truth from Supabase dashboard):
 *
 *   orders
 *   ──────
 *   id               uuid  PK
 *   customer_name    text  NOT NULL
 *   customer_phone   text  NOT NULL
 *   shipping_address text  NOT NULL
 *   city             text
 *   total_amount     numeric NOT NULL
 *   status           text  DEFAULT 'Pending'
 *   payment_method   text
 *   customer_email   text  (nullable)
 *   created_at       timestamptz DEFAULT now()
 *
 *   order_items
 *   ───────────
 *   id             uuid  PK
 *   order_id       uuid  FK → orders.id
 *   product_id     uuid  (nullable)
 *   product_title  text
 *   size           text
 *   color          text
 *   quantity       int
 *   price          numeric
 */

import { supabase } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderCustomer {
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
}

export interface OrderLineItem {
  product_id: string;
  product_title: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface SubmitOrderParams {
  customer: OrderCustomer;
  items: OrderLineItem[];
  total_amount: number;
  payment_method?: string;
}

export type OrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

// ─── Validation ───────────────────────────────────────────────────────────────

export interface ValidationErrors {
  customer_name?: string;
  customer_phone?: string;
  city?: string;
  shipping_address?: string;
}

/**
 * Validates customer fields before hitting Supabase.
 * Returns an object of field-level errors; empty object means valid.
 */
export function validateCustomer(
  customer: OrderCustomer,
  lang: string
): ValidationErrors {
  const ar = lang === 'ar';
  const errors: ValidationErrors = {};

  if (!customer.customer_name.trim()) {
    errors.customer_name = ar ? 'الرجاء إدخال الاسم الكامل.' : 'Please enter your full name.';
  }
  if (!customer.customer_phone.trim()) {
    errors.customer_phone = ar ? 'الرجاء إدخال رقم الهاتف.' : 'Please enter your phone number.';
  }
  if (!customer.city.trim()) {
    errors.city = ar ? 'الرجاء إدخال المدينة.' : 'Please enter your city.';
  }
  if (!customer.shipping_address.trim()) {
    errors.shipping_address = ar
      ? 'الرجاء إدخال عنوان الشحن.'
      : 'Please enter your shipping address.';
  }

  return errors;
}

// ─── Core submission ──────────────────────────────────────────────────────────

/**
 * Submits a complete order to Supabase in two steps:
 *   1. Insert the order row → get back its id
 *   2. Insert all order_item rows linked to that id
 *
 * Returns { ok: true, orderId } on full success.
 * Returns { ok: false, error } on any failure — never throws.
 */
export async function submitOrder(params: SubmitOrderParams): Promise<OrderResult> {
  const { customer, items, total_amount, payment_method = 'Cash on Delivery' } = params;

  if (items.length === 0) {
    return { ok: false, error: 'No items in order.' };
  }

  // Generate the order id on the client
  const orderId = crypto.randomUUID();

  // ── Step 1: insert order ──────────────────────────────────────────────────
  const { error: orderError } = await supabase
    .from('orders')
    .insert({
      id:               orderId,
      customer_name:    customer.customer_name.trim(),
      customer_phone:   customer.customer_phone.trim(),
      shipping_address: customer.shipping_address.trim(),
      city:             customer.city.trim(),
      total_amount,
      status:           'Pending',
      payment_method,
    });

  if (orderError) {
    console.error('[orderService] order insert failed:', orderError);
    return {
      ok: false,
      error: orderError.message ?? 'Failed to create order.',
    };
  }

  // ── Step 2: insert order items ────────────────────────────────────────────
  const rows = items.map(item => ({
    id:            crypto.randomUUID(),
    order_id:      orderId,
    product_id:    item.product_id,
    product_title: item.product_title,
    size:          item.size,
    color:         item.color,
    quantity:      item.quantity,
    price:         item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(rows);

  if (itemsError) {
    console.error('[orderService] order_items insert failed:', itemsError);
    return { ok: false, error: `Failed to save order items: ${itemsError.message}` };
  }

  return { ok: true, orderId };
}
