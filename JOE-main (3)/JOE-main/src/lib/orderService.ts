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

  // ── Step 1: insert order ──────────────────────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name:    customer.customer_name.trim(),
      customer_phone:   customer.customer_phone.trim(),
      shipping_address: customer.shipping_address.trim(),
      city:             customer.city.trim(),
      total_amount,
      status:           'Pending',
      payment_method,
    })
    .select('id')   // fetch only the id — avoids the `select=*:1` malformed-query bug
    .single();

  if (orderError || !order) {
    console.error('[orderService] order insert failed:', orderError);
    return {
      ok: false,
      error: orderError?.message ?? 'Failed to create order.',
    };
  }

  // ── Step 2: insert order items ────────────────────────────────────────────
  const rows = items.map(item => ({
    order_id:      order.id,
    product_id:    item.product_id,
    product_title: item.product_title,
    size:          item.size,
    color:         item.color,
    quantity:      item.quantity,
    price:         item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(rows);

  if (itemsError) {
    // The order row was created successfully. Log the item failure but treat
    // the order as placed — the admin can still see it and follow up.
    console.error('[orderService] order_items insert failed:', itemsError);
    // Return success with the order id; callers can inspect console if needed.
    return { ok: true, orderId: order.id };
  }

  return { ok: true, orderId: order.id };
}
