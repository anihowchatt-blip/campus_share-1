import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, isCheckingAuth } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 animate-bounce">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Verifying clearance...
        </p>
      </div>
    );
  }

  if (requireAdmin) {
    if (!isAuthenticated || user?.role !== 'admin') {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
  } else if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
