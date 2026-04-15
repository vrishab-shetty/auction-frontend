import React from 'react';
import { ChevronLeft, ChevronRight, Loader2, LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgColorClass: string;
  isFetching?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrefetch?: (page: number) => void;
  };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColorClass,
  iconBgColorClass,
  isFetching,
  pagination,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl shadow-lg ${iconBgColorClass} ${iconColorClass}`}>
          <Icon size={24} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight">{title}</h2>
            {isFetching && (
              <div className="flex items-center gap-2 text-xs font-bold text-brand-secondary animate-pulse">
                <Loader2 size={14} className="animate-spin" />
                <span>Syncing...</span>
              </div>
            )}
          </div>
          <p className="text-brand-neutral font-medium">{subtitle}</p>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 self-end md:self-auto">
          <button
            onClick={() => pagination.onPageChange(Math.max(0, pagination.currentPage - 1))}
            onMouseEnter={() => pagination.onPrefetch?.(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 0 || isFetching}
            className="p-2 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-sm font-black text-brand-primary">{pagination.currentPage + 1}</span>
            <span className="text-xs font-bold text-gray-400">/</span>
            <span className="text-sm font-bold text-gray-400">{pagination.totalPages}</span>
          </div>

          <button
            onClick={() => pagination.onPageChange(Math.min(pagination.totalPages - 1, pagination.currentPage + 1))}
            onMouseEnter={() => pagination.onPrefetch?.(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages - 1 || isFetching}
            className="p-2 rounded-xl hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
