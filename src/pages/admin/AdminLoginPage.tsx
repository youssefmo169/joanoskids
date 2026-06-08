import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLang } from '../../contexts/LanguageContext';

export default function AdminLoginPage() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError(t('invalidCredentials'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            <span className="text-pink-500">Jo</span>
            <span className="text-neutral-300 mx-1">&</span>
            <span className="text-sky-500">Anos</span>
            <span className="text-neutral-600 ml-1 text-sm font-medium">Kids</span>
          </h1>
          <p className="text-sm text-neutral-500 mt-2">{t('adminPortal')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">{t('signIn')}</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('email')}</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Enter Email/Phone"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-700 mb-1.5 block">{t('password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-neutral-200 rounded-lg pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder={t('enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
