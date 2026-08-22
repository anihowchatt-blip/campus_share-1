import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center shadow-soft">
          <HelpCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white font-display">404</h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page or listing you are looking for might have been removed, sold, or is temporarily unavailable.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/browse">
            <Button variant="outline" icon={ArrowLeft}>
              Browse Items
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
