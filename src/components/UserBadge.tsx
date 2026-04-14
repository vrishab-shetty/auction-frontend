import React from 'react';
import { UserSummary } from '@/api/types';
import { User as UserIcon } from 'lucide-react';

interface UserBadgeProps {
  user?: UserSummary | null;
  fallback?: string;
  className?: string;
}

export const UserBadge: React.FC<UserBadgeProps> = ({ user, fallback = 'Anonymous', className = '' }) => {
  if (!user) {
    return (
      <div className={`flex items-center gap-2 text-brand-neutral ${className}`}>
        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
          <UserIcon size={12} />
        </div>
        <span className="text-sm font-medium">{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-brand-primary ${className}`} title={user.email}>
      <div className="w-6 h-6 bg-brand-secondary/20 text-brand-secondary rounded-full flex items-center justify-center">
        <UserIcon size={12} />
      </div>
      <span className="text-sm font-bold truncate max-w-[150px]">{user.name}</span>
    </div>
  );
};
