import React from 'react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Database, Info } from 'lucide-react';

export const DemoNotice: React.FC = () => {
  if (isSupabaseConfigured) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Preview Mode:</strong> Currently displaying demonstration data. To activate live PostgreSQL database and image uploads, configure <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">VITE_SUPABASE_URL</code> in your <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">.env</code> file.
          </span>
        </div>
        <span className="hidden md:inline-flex items-center gap-1 text-amber-700 font-medium">
          <Database className="w-3.5 h-3.5" />
          Seed Data Ready
        </span>
      </div>
    </div>
  );
};
