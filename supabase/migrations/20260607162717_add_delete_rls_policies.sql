-- Add DELETE policies for order_items (admin deletes items before orders)
CREATE POLICY "order_items_admin_delete" ON order_items FOR DELETE
  TO anon, authenticated USING (true);

-- Add DELETE policies for orders (admin deletes orders)
CREATE POLICY "orders_admin_delete" ON orders FOR DELETE
  TO anon, authenticated USING (true);
