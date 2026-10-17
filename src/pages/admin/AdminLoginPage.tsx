import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Logo } from '@/components/common/Logo';
import { Lock, Mail, Loader2, ArrowLeft, AlertCircle, Info } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAdmin, loading: authLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, authLoading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    const result = await login(data);
    if (result.success) {
      navigate('/admin');
    } else {
      setErrorMessage(result.error || 'Failed to authenticate.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Return to website */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center">
          <Logo light className="justify-center" />
          <h2 className="mt-4 text-2xl font-extrabold text-white tracking-tight">
            Administrator Portal
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Sign in to manage property listings, image galleries, and customer enquiries.
          </p>
        </div>

        {/* Demo Notice Helper Box if Supabase credentials are not wired yet */}
        {!isSupabaseConfigured && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Preview Demo Mode</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/90">
              Supabase credentials are not yet configured in <code className="bg-amber-900/60 px-1 py-0.5 rounded font-mono">.env</code>. You can log in using any email and password <code className="bg-amber-900/60 px-1 py-0.5 rounded font-mono font-bold">admin123</code> to preview the full admin dashboard.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="mt-6 bg-navy-900/90 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@arthproperties.in"
                  {...register('email')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-navy-950/80 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 disabled:opacity-50 text-navy-950 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In as Administrator</span>
                )}
              </button>
            </div>
          </form>

          {/* Secure access notice */}
          <div className="mt-6 pt-5 border-t border-navy-800 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Restricted to authorized administrators. Unauthenticated access and self-registration are strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
