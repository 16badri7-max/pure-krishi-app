import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  badge,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#176B45]/10 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-[#66736A] uppercase tracking-wider">{title}</span>
          <div className="text-2xl font-bold font-display text-[#17231C] mt-1">{value}</div>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#F0F7F0] text-[#176B45] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || change || badge) && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
          {change && (
            <span className={`font-semibold ${isPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
              {isPositive ? '▲ ' : '▼ '}{change}
            </span>
          )}
          {subtitle && <span className="text-[#66736A]">{subtitle}</span>}
          {badge && (
            <span className="ml-auto bg-[#FAF8F0] text-[#176B45] font-medium px-2 py-0.5 rounded border border-[#176B45]/15">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
