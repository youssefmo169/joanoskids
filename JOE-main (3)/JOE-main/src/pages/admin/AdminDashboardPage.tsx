import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ShoppingBag, LogOut, Plus, Pencil, Trash2, X, Check, ArrowLeft, Tags } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang, type TKey } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { Product, Order, OrderItem, Category } from '../../types';
import dashboardBg from '../../assets/admin-dashboard-bg.jpeg';

type Tab = 'orders' | 'products' | 'categories';
type OrderWithItems = Order & { items: OrderItem[] };
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function ensureString(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  return String(val);
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

// تعديل دوال الـ normalize لتطابق أعمدة Supabase الفعلية
function normalizeOrder(raw: Record<string, any>, items: OrderItem[] = []): OrderWithItems {
  return {
    ...raw,
    id: ensureString(raw.id),
    total_price: Number(raw.total_amount) || 0, // ربط total_price بـ total_amount من الجدول
    shipping_address: ensureString(raw.shipping_address),
    customer_phone: ensureString(raw.customer_phone),
    items,
  } as OrderWithItems;
}

export default function AdminDashboardPage() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { t, formatPrice, lang } = useLang();
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) navigate('/admin/login', { replace: true });
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    if (tab === 'orders') fetchOrders();
  }, [tab, isAdmin]);

  const fetchOrders = async () => {
    setLoading(true);
    // تم تعديل الـ select لتجلب الأسماء الصحيحة كما هي في الجدول
    const { data: orderData } = await supabase
      .from('orders')
      .select('id, created_at, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, payment_method')
      .order('created_at', { ascending: false });

    const { data: itemData } = await supabase.from('order_items').select('*');

    const normalizedItems = (itemData || []).map(item => ({
      ...item,
      order_id: ensureString(item.order_id),
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 0
    }));

    const itemsByOrder = normalizedItems.reduce<Record<string, OrderItem[]>>((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item as OrderItem);
        return acc;
      }, {});
      
    setOrders((orderData || []).map(o => normalizeOrder(o, itemsByOrder[String(o.id)] || [])));
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) { alert(`Error: ${error.message}`); return; }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('order_items').delete().eq('order_id', orderId);
    await supabase.from('orders').delete().eq('id', orderId);
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleLogout = () => { logout(); navigate('/'); };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-red-500">Logout</button>
      </header>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-lg border border-neutral-200">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">{order.customer_name}</h3>
                <p className="text-sm">{order.customer_phone}</p>
                <p className="text-sm">{order.shipping_address}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(order.total_price)}</p>
                <span className="text-xs bg-neutral-100 px-2 py-1 rounded">{order.status}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => updateStatus(order.id, 'Completed')} className="bg-green-500 text-white px-3 py-1 text-xs rounded">Complete</button>
              <button onClick={() => deleteOrder(order.id)} className="bg-red-500 text-white px-3 py-1 text-xs rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
