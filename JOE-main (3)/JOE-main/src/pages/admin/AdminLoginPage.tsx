// ═══════════════════════════════════════════════════════════════════════════════
// TASK 6 — CRITICAL SECURITY FIX: Admin Credential Exposure
// ═══════════════════════════════════════════════════════════════════════════════
//
// PROBLEM
// -------
// If your admin password is currently hardcoded in the React source like:
//
//   const ADMIN_PASSWORD = 'mypassword123';
//   if (password === ADMIN_PASSWORD) { setLoggedIn(true); }
//
// …then ANY visitor can open DevTools → Sources and read it. Even if you put
// it in a .env file as VITE_ADMIN_PASSWORD, Vite bundles env vars that start
// with VITE_ into the browser JS bundle — still visible in DevTools.
//
// THE RIGHT FIX: Use Supabase Auth (you already have Supabase!)
// ─────────────────────────────────────────────────────────────
// Supabase Auth is built-in, free, and takes ~10 minutes to set up.
// Credentials are checked server-side; the browser NEVER sees the password.
//
// STEP-BY-STEP SETUP
// ──────────────────
// 1. Go to your Supabase dashboard → Authentication → Users
// 2. Click "Add user" → enter admin email + a strong password → Save
// 3. Go to Authentication → Settings → turn OFF "Enable email confirmations"
//    (so you can log in immediately without verifying email)
// 4. In your Supabase dashboard → SQL Editor, run this to lock down the
//    admin tables (replace 'your-admin-user-id' with the UUID shown for
//    your new user):
//
//      -- Only the admin user can read/write orders
//      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
//      CREATE POLICY "admin_only" ON orders
//        USING (auth.uid() = 'your-admin-user-id');
//
// 5. Replace your current AdminPage login logic with the code below.
// ─────────────────────────────────────────────────────────────────────────────

// FILE: src/pages/AdminLoginPage.tsx  (replace your existing login component)
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLang } from '../contexts/LanguageContext';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const { t, lang } = useLang();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // ✅ Password is sent to Supabase servers over HTTPS — never in JS bundle
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials');
      return;
    }

    onLogin(); // proceed into the dashboard
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-neutral-900 mb-6 text-center">{t('adminPortal')}</h1>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('email')}</label>
            <input
              required type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('password')}</label>
            <input
              required type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder={t('enterPassword')}
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-neutral-900 text-white py-3 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO PROTECT THE ADMIN DASHBOARD ROUTE
// ─────────────────────────────────────────────────────────────────────────────
//
// In your AdminDashboard / AdminPage, add a session check at the top:
//
//   import { useEffect, useState } from 'react';
//   import { supabase } from '../lib/supabase';
//
//   export default function AdminPage() {
//     const [checked, setChecked] = useState(false);
//     const [authed,  setAuthed]  = useState(false);
//
//     useEffect(() => {
//       supabase.auth.getSession().then(({ data }) => {
//         setAuthed(!!data.session);
//         setChecked(true);
//       });
//     }, []);
//
//     if (!checked) return null; // or a spinner
//     if (!authed)  return <AdminLoginPage onLogin={() => setAuthed(true)} />;
//
//     return <Dashboard />; // your real admin UI
//   }
//
// For the logout button:
//   await supabase.auth.signOut();
//   setAuthed(false);
//
// ─────────────────────────────────────────────────────────────────────────────
// WHAT NOT TO DO
// ─────────────────────────────────────────────────────────────────────────────
// ❌  const PASS = 'secret'          → visible in DevTools Sources
// ❌  VITE_ADMIN_PASS=secret (.env)  → still bundled into JS by Vite
// ❌  Comparing against localStorage → can be spoofed by anyone
// ✅  supabase.auth.signInWithPassword → server-side check, token in memory
