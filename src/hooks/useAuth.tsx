import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LoginFormData } from '@/utils/validation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isDemoAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoAuth, setIsDemoAuth] = useState<boolean>(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check if session storage has demo login
      const demoUser = sessionStorage.getItem('arth_demo_admin');
      if (demoUser) {
        setIsDemoAuth(true);
      }
      setLoading(false);
      return;
    }

    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      // In preview demo mode before Supabase credentials are wired
      if (password === 'admin123' || password.length >= 6) {
        setIsDemoAuth(true);
        sessionStorage.setItem('arth_demo_admin', 'true');
        return { success: true };
      }
      return {
        success: false,
        error: 'Invalid password. (For demo preview mode, any password >= 6 chars like "admin123" works)',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Invalid email or password. Please verify your credentials.',
        };
      }

      setUser(data.user);
      setSession(data.session);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'An unexpected error occurred during authentication.',
      };
    }
  };

  const logout = async (): Promise<void> => {
    if (!isSupabaseConfigured) {
      setIsDemoAuth(false);
      sessionStorage.removeItem('arth_demo_admin');
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const isAdmin = isSupabaseConfigured ? Boolean(user) : isDemoAuth;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        login,
        logout,
        isDemoAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
