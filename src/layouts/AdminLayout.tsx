import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Logo } from '@/components/common/Logo';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  MessageSquareText,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Database,
  Menu,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout, isDemoAuth, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Protected route guard
  React.useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'All Properties', path: '/admin/properties', icon: Building },
    { name: 'Add New Property', path: '/admin/properties/new', icon: PlusCircle },
    { name: 'Customer Enquiries', path: '/admin/enquiries', icon: MessageSquareText },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-950 text-white px-4 py-3 flex items-center justify-between border-b border-navy-800">
        <Logo light showTagline={false} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-navy-950 text-slate-300 border-r border-navy-800/80 flex flex-col justify-between transform transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand & Admin Badge */}
          <div className="p-5 border-b border-navy-800/80">
            <Logo light />
            <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-navy-900 border border-gold-500/30 text-gold-300 text-[11px] font-bold">
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span>Administration Portal</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-gold-500 text-navy-950 shadow-sm font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-navy-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: Status & Logout */}
        <div className="p-4 border-t border-navy-800/80 space-y-3">
          {/* Status Badge */}
          <div className="px-3 py-2 rounded-xl bg-navy-900 border border-navy-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 mb-1 font-semibold text-slate-300">
              <Database className="w-3.5 h-3.5 text-gold-500" />
              <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Demo Preview Auth'}</span>
            </div>
            <p className="truncate text-[10px]">
              {user?.email || 'Demonstration Mode'}
            </p>
          </div>

          {/* View Website Link */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-navy-900 rounded-lg transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
