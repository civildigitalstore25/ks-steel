import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginAdmin } from '../../services/api';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('superadmin@kssteel.com');
  const [password, setPassword] = useState('SuperAdmin@123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await loginAdmin({ email, password });
      setUser(data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid superadmin credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1728] flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-[#14263D] rounded-2xl p-8 border border-slate-700/80 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#D7A94B] text-[#0B1728] rounded-xl flex items-center justify-center font-extrabold text-2xl mx-auto shadow-lg">
            KS
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">
            K.S. STEEL CORPORATION
          </h1>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D7A94B]" />
            <span>Superadmin Login Portal</span>
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Superadmin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@kssteel.com"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1728] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D7A94B] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#0B1728] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D7A94B] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#D7A94B] hover:bg-[#C5973A] text-[#0B1728] font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#0B1728] border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Login to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          Superadmin access only • Protected by JWT Session
        </div>

      </div>
    </div>
  );
};
