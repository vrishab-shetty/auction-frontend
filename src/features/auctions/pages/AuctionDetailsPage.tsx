import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuctionDetails } from '../hooks/useAuctionDetails';
import { useAuctionStream } from '../hooks/useAuctionStream';
import { AuctionStatusBadge } from '../components/AuctionStatusBadge';
import { ItemCard } from '@/components/ItemCard';
import { Navbar } from '@/features/core/components/Navbar';
import { UserBadge } from '@/components/UserBadge';
import { Calendar, Clock, Package, Signal, SignalLow } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

const AuctionDetailsPage: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { data: auction, isLoading, isError } = useAuctionDetails(auctionId!);

  const isLive = auction?.status === 'ACTIVE';

  const { lastEvent, isConnected } = useAuctionStream(auctionId, isLive);
  const [items, setItems] = useState(auction?.items || []);

  useEffect(() => {
    if (auction?.items) {
      setItems(auction.items);
    }
  }, [auction?.items]);

  useEffect(() => {
    if (lastEvent) {
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === lastEvent.itemId 
            ? { ...item, currentBid: lastEvent.currentPrice, buyer: lastEvent.buyer } 
            : item
        )
      );
    }
  }, [lastEvent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 space-y-8">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-lg" />
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="h-10 w-1/3 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-20 w-full bg-gray-200 animate-pulse rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-brand-primary">Auction Not Found</h2>
          <p className="text-brand-neutral">The auction you are looking for might have been removed or does not exist.</p>
          <Link to="/dashboard" className="inline-block bg-brand-primary text-brand-white px-6 py-2 rounded-xl font-bold">
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const isClosed = auction.status === 'ENDED';

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 space-y-8">
        {/* Auction Header */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-brand-secondary" />
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black text-brand-primary tracking-tight">
                  {auction.name}
                </h1>
                <div className="flex items-center gap-2">
                  <AuctionStatusBadge status={auction.status} />
                  {isLive && (
                    <div 
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors ${
                        isConnected ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'
                      }`}
                      title={isConnected ? 'Live updates active' : 'Live updates disconnected'}
                    >
                      {isConnected ? <Signal size={14} /> : <SignalLow size={14} />}
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-brand-neutral text-lg leading-relaxed max-w-3xl">
                Experience elite bidding on exclusive items curated specifically for this event. 
                All participants must have a verified payment method.
              </p>

              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-brand-primary font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <Calendar size={18} className="text-brand-secondary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">Starts</span>
                    <span className="text-sm">{new Date(auction.startTime).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-brand-primary font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <Clock size={18} className="text-brand-secondary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">Ends</span>
                    <span className="text-sm">{new Date(auction.endTime).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-brand-primary font-bold bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">Organizer</span>
                    <UserBadge user={auction.seller} />
                  </div>
                </div>
              </div>
            </div>

            {!isClosed && (
              <div className="bg-brand-primary p-6 rounded-2xl text-brand-white shadow-xl shadow-brand-primary/20 w-full md:w-auto min-w-[200px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60 text-brand-white">Time Remaining</p>
                <p className="text-2xl font-black">{formatRelativeTime(new Date(auction.endTime))}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-brand-secondary/20 p-2 rounded-lg text-brand-secondary">
              <Package size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight">Auction Items</h2>
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-sm font-bold">
              {auction.items.length} Total
            </span>
          </div>

          {auction.items.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center space-y-4">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-gray-400 shadow-sm">
                <Package size={32} />
              </div>
              <p className="text-brand-neutral font-medium">No items have been listed for this auction yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} auctionId={auctionId} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AuctionDetailsPage;
