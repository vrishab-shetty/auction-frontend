import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface AuctionStatusBadgeProps {
  startTime: string;
  endTime: string;
}

type Status = 'Scheduled' | 'Live' | 'Closed';

export const AuctionStatusBadge: React.FC<AuctionStatusBadgeProps> = ({ startTime, endTime }) => {
  const [status, setStatus] = useState<Status>('Scheduled');

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        setStatus('Scheduled');
      } else if (now > end) {
        setStatus('Closed');
      } else {
        setStatus('Live');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const getStyles = () => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Live': return 'bg-green-100 text-green-600 border-green-200 animate-pulse';
      case 'Closed': return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'Scheduled': return <Calendar size={14} />;
      case 'Live': return <Clock size={14} />;
      case 'Closed': return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStyles()}`}>
      {getIcon()}
      {status}
    </div>
  );
};
