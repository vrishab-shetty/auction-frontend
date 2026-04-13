import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuctionDTO } from '@/features/auctions/types';
import { Clock, Tag, User, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

interface AuctionCardProps {
  auction: AuctionDTO;
}

type AuctionStatus = 'Scheduled' | 'Active' | 'Finished';

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
  const [status, setStatus] = useState<AuctionStatus>('Active');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const start = new Date(auction.startTime);
      const end = new Date(auction.endTime);

      if (now < start) {
        setStatus('Scheduled');
        setTimeLeft(formatRelativeTime(start));
        return;
      }

      if (now > end) {
        setStatus('Finished');
        setTimeLeft('Closed');
        return;
      }

      setStatus('Active');
      setTimeLeft(formatRelativeTime(end));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.startTime, auction.endTime]);

  const getStatusStyles = () => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-600';
      case 'Finished': return 'bg-gray-100 text-gray-500';
      default: return 'bg-green-100 text-green-600';
    }
  };

  const handleViewAuction = () => {
    sessionStorage.setItem('dashboard-scroll', window.scrollY.toString());
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-brand-primary line-clamp-1">{auction.name}</h3>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusStyles()}`}>
            {status}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-brand-neutral">
          <div className="flex items-center gap-1">
            {status === 'Scheduled' ? <Calendar size={16} className="text-blue-500" /> : <Clock size={16} />}
            <span className={status === 'Scheduled' ? 'text-blue-600 font-medium' : ''}>
              {status === 'Scheduled' ? `Starts in: ${timeLeft}` : timeLeft}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <User size={16} />
            <span className="truncate">{auction.user}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Featured Items</p>
          <div className="space-y-3">
            {auction.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl transition-all hover:bg-gray-100 group">
                <div className="flex items-center gap-3">
                  <Tag size={14} className="text-brand-secondary" />
                  <span className="text-sm font-medium text-brand-primary line-clamp-1">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Current Bid</p>
                  <p className="text-sm font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">
                    ${item.currentBid || item.initialPrice}
                  </p>
                </div>
              </div>
            ))}
            {auction.items.length > 3 && (
              <p className="text-xs text-center text-brand-neutral font-medium italic pt-1">
                + {auction.items.length - 3} more items
              </p>
            )}
          </div>
        </div>

        <Link 
          to={`/auctions/${auction.id}`}
          onClick={handleViewAuction}
          className="w-full bg-brand-primary text-brand-white py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-primary/20 mt-4 block text-center"
        >
          View Auction
        </Link>
      </div>
    </div>
  );
};
