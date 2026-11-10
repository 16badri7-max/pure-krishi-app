import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'blue' | 'red' | 'purple' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'green', className = '' }) => {
  const styles = {
    green: 'bg-[#F0F7F0] text-[#176B45] border-[#DCECDC]',
    amber: 'bg-[#FEF9E7] text-[#B7791F] border-[#FDE68A]',
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    red: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    purple: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
