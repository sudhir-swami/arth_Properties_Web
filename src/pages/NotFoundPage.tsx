import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-md w-full text-center">
        <span className="text-5xl font-black text-gold-500 block mb-2">404</span>
        <h1 className="text-xl font-extrabold text-navy-900 mb-2">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-8 leading-relaxed">
          The page or property listing you are looking for does not exist or may have been relocated.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Home className="w-4 h-4 text-gold-400" />
            <span>Go to Homepage</span>
          </Link>

          <Link
            to="/properties"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
