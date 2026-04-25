import React from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { AuctionStatus } from '../types';

interface AuctionStatusBadgeProps {
  status: AuctionStatus;
}

const labelMap: Record<AuctionStatus, string> = {
  SCHEDULED: 'Scheduled',
  ACTIVE: 'Live',
  ENDED: 'Closed',
};

export const AuctionStatusBadge: React.FC<AuctionStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'ACTIVE':    return 'bg-green-100 text-green-600 border-green-200 animate-pulse';
      case 'ENDED':     return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'SCHEDULED': return <Calendar size={14} />;
      case 'ACTIVE':    return <Clock size={14} />;
      case 'ENDED':     return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStyles()}`}>
      {getIcon()}
      {labelMap[status]}
    </div>
  );
};
