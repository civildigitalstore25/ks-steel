import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1728] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D7A94B] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold tracking-wider text-slate-300">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products Management', path: '/admin/products', icon: Package },
    { name: 'Add New Product', path: '/admin/products/new', icon: PlusCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] font-sans flex flex-col md:flex-row">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-[#0B1728] text-white flex-col justify-between shrink-0 shadow-xl min-h-screen sticky top-0">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D7A94B] text-[#0B1728] rounded-lg flex items-center justify-center font-extrabold text-base shadow">
              KS
            </div>
            <div>
              <h1 className="font-extrabold text-base text-white tracking-wide leading-tight">
                K.S. STEEL
              </h1>
              <span className="text-[10px] font-bold text-[#D7A94B] uppercase tracking-widest block">
                ADMIN PORTAL
              </span>
            </div>
          </div>

          {/* User Profile Badge */}
          <div className="px-6 py-4 bg-[#14263D]/60 border-b border-slate-800 flex items-center gap-3 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#D7A94B] shrink-0" />
            <div className="overflow-hidden">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Logged in as</span>
              <span className="font-bold text-white truncate block">{user?.email}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                    active
                      ? 'bg-[#D7A94B] text-[#0B1728] shadow-md'
                      : 'text-slate-300 hover:bg-[#14263D] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full bg-[#14263D] hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D7A94B]" />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center justify-center gap-2 w-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors border border-red-500/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#0B1728] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#D7A94B] text-[#0B1728] rounded flex items-center justify-center font-extrabold text-xs">
            KS
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide">
            K.S. STEEL ADMIN
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1728] text-white p-4 space-y-3 border-b border-slate-800 shadow-xl">
          <div className="px-3 py-2 bg-[#14263D] rounded-lg text-xs text-slate-300">
            Logged in as <strong className="text-white">{user?.email}</strong>
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold ${
                    active ? 'bg-[#D7A94B] text-[#0B1728]' : 'text-slate-300 hover:bg-[#14263D]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#14263D] text-white text-xs font-bold py-2.5 rounded-lg"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#D7A94B]" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 bg-red-600/20 text-red-300 text-xs font-bold py-2.5 rounded-lg"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

    </div>
  );
};
