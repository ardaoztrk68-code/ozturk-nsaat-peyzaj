import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

// Admin paneline giriş için parola — ihtiyacınıza göre değiştirin
const ADMIN_PASSWORD = 'ozturk2026';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  if (sessionStorage.getItem('atelier_admin_auth') === 'true') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('atelier_admin_auth', 'true');
      setError(false);
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2D2A26] px-6">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Brand mark */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-2xl font-semibold tracking-[0.25em] text-[#FAF8F5] sm:text-3xl sm:tracking-[0.3em]">
            ÖZTÜRK İNŞAAT &amp; PEYZAJ
          </h1>
          <p className="mt-3 font-sans text-xs font-medium tracking-widest uppercase text-[#8B8580]">
            Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-sans text-[10px] font-medium tracking-widest uppercase text-[#8B8580]"
            >
              Parola
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
              className={`w-full border-b bg-transparent px-1 py-3 font-sans text-sm text-[#FAF8F5] outline-none transition-colors placeholder:text-[#5C5752] ${
                error ? 'border-red-500/60' : 'border-[#5C5752] focus:border-[#B8956A]'
              }`}
              placeholder="••••••••"
            />
            {error && (
              <p className="mt-2 font-sans text-xs text-red-400/80">
                Hatalı parola. Lütfen tekrar deneyin.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full border border-[#5C5752] bg-transparent py-3.5 font-sans text-xs font-medium tracking-widest uppercase text-[#B8956A] transition-all duration-500 hover:border-[#B8956A] hover:bg-[#B8956A] hover:text-[#2D2A26]"
          >
            Giriş Yap
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-12 text-center font-sans text-[11px] text-[#5C5752]">
          Yetkisiz erişim yasaktır.
        </p>
      </div>
    </div>
  );
}
