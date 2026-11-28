import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from './auth';
import type { UserRole } from '../types';

interface RequireRoleProps {
  allowedRoles: UserRole[];
  portalName: string;
  fallbackLogin: React.ReactNode;
  children: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  allowedRoles,
  portalName,
  fallbackLogin,
  children,
}) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F0]">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#176B45] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#104D35]">Verifying authorized session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <>{fallbackLogin}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectPath =
      user.role === 'super_admin' || user.role === 'operations_admin'
        ? '/admin'
        : user.role === 'farmer'
        ? '/farmer'
        : '/customer';

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F0] p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 shadow-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#17231C]">Access Restricted — {portalName}</h2>
            <p className="text-xs text-[#66736A] mt-1 leading-relaxed">
              Your current session role (<strong>{user.role.replace('_', ' ')}</strong>) is not authorized to open the{' '}
              <strong>{portalName}</strong>. Each application operates with strict role-based isolation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link
              to={redirectPath}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#176B45] hover:bg-[#104D35] text-white text-xs font-bold transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to My Portal</span>
            </Link>
            <button
              onClick={() => void logout()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
