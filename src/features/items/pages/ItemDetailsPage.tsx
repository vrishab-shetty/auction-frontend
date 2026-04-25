import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItemDetails } from '@/features/auctions/hooks/useItemDetails';
import { usePlaceBid } from '@/features/auctions/hooks/usePlaceBid';
import { useAuctionStream } from '@/features/auctions/hooks/useAuctionStream';
import { useAuctionDetails } from '@/features/auctions/hooks/useAuctionDetails';
import { AuctionStatusBadge } from '@/features/auctions/components/AuctionStatusBadge';
import { Navbar } from '@/features/core/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { UserBadge } from '@/components/UserBadge';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  AlertCircle, 
  Gavel,
  History,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Info,
  Signal,
  SignalLow
} from 'lucide-react';
import { AxiosError } from 'axios';
import { Result, UserSummary } from '@/api/types';

const ItemDetailsPage: React.FC = () => {
  const { auctionId: urlAuctionId, itemId } = useParams<{ auctionId: string; itemId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  
  const { data: item, isLoading: itemLoading, isError: itemError } = useItemDetails(itemId!);
  
  const effectiveAuctionId = urlAuctionId || item?.auctionId;

  const { data: auction } = useAuctionDetails(effectiveAuctionId || 'NONE');
  
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!auction || effectiveAuctionId === 'NONE') return;
    
    const updateStatus = () => {
      const now = new Date().getTime();
      const start = new Date(auction.startTime).getTime();
      const end = new Date(auction.endTime).getTime();
      setIsLive(now >= start && now <= end);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [auction, effectiveAuctionId]);

  const { lastEvent, isConnected } = useAuctionStream(effectiveAuctionId, isLive);
  const placeBidMutation = usePlaceBid();

  const [bidAmount, setBidAmount] = useState<string>('');
  const [localCurrentBid, setLocalCurrentBid] = useState<number>(0);
  const [localBuyer, setLocalCurrentBuyer] = useState<UserSummary | null>(null);
  const [isPulse, setIsPulse] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (item) {
      const basePrice = item.currentBid || item.initialPrice;
      setLocalCurrentBid(basePrice);
      setLocalCurrentBuyer(item.buyer || null);
      
      const suggestedBid = item.currentBid ? basePrice + 1 : basePrice;
      setBidAmount(suggestedBid.toString());
    }
  }, [item]);

  useEffect(() => {
    if (lastEvent && lastEvent.itemId === itemId) {
      if (lastEvent.currentPrice > localCurrentBid) {
        setLocalCurrentBid(lastEvent.currentPrice);
        setLocalCurrentBuyer(lastEvent.buyer);
        setIsPulse(true);
        setTimeout(() => setIsPulse(false), 1000);
        
        if (parseFloat(bidAmount) <= lastEvent.currentPrice) {
          setBidAmount((lastEvent.currentPrice + 1).toString());
        }
      }
    }
  }, [lastEvent, itemId, localCurrentBid, bidAmount]);

  const isOwner = Boolean(
    currentUser?.username && 
    item?.seller?.email && 
    currentUser.username.toLowerCase().trim() === item.seller.email.toLowerCase().trim()
  );

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwner || !effectiveAuctionId) return;

    setConflictError(null);
    setSuccessMessage(null);
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= localCurrentBid) {
      alert(`Bid must be greater than $${localCurrentBid}`);
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to place a bid of $${amount.toLocaleString()}? Bids are legally binding.`);
    if (!confirmed) return;

    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    placeBidMutation.mutate(
      { auctionId: effectiveAuctionId!, itemId: itemId!, bidAmount: amount },
      {
        onSuccess: () => {
          setSuccessMessage(`Success! You are now the leading bidder at $${amount.toLocaleString()}.`);
          setIsProcessing(false);
          setTimeout(() => setSuccessMessage(null), 5000);
        },
        onError: (err: unknown) => {
          setIsProcessing(false);
          const axiosError = err as AxiosError<Result<number>>;
          const serverResult = axiosError.response?.data;
          const status = axiosError.response?.status;

          if (status === 409 || status === 400) {
            const newPrice = typeof serverResult?.data === 'number' ? serverResult.data : localCurrentBid;
            setConflictError('Bid Outdated! Please update your bid.');
            
            setLocalCurrentBid(newPrice);
            setBidAmount((newPrice + 1).toString());
            setIsPulse(true);
            setTimeout(() => setIsPulse(false), 1000);
          } else {
            setConflictError(serverResult?.message || 'An unexpected error occurred');
          }
        }
      }
    );
  };

  if (itemLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 space-y-8 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-3xl" />
            <div className="space-y-6">
              <div className="h-12 w-3/4 bg-gray-200 rounded-xl" />
              <div className="h-32 w-full bg-gray-200 rounded-xl" />
              <div className="h-48 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 text-center space-y-4">
          <AlertCircle className="mx-auto text-red-500" size={64} />
          <h2 className="text-3xl font-black text-brand-primary">Item Not Found</h2>
          <p className="text-brand-neutral">We couldn't find the item you're looking for.</p>
          <button onClick={() => navigate(-1)} className="bg-brand-primary text-brand-white px-8 py-3 rounded-xl font-bold">
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const isClosed = auction ? new Date(auction.endTime).getTime() < new Date().getTime() : false;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 md:p-8 pt-10 space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-brand-neutral hover:text-brand-primary font-bold transition-colors group"
          >
            <div className="p-2 rounded-xl group-hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span>Back to results</span>
          </button>

          {!effectiveAuctionId && (
            <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100 flex items-center gap-2">
              <Info size={16} />
              Resolving Auction Context...
            </div>
          )}
        </div>

        {/* Item Title Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-secondary font-black text-xs uppercase tracking-[0.2em]">
            <Gavel size={14} />
            <span>{auction?.name || 'Auction Item'}</span>
          </div>
          <h1 className="text-5xl font-black text-brand-primary tracking-tight">
            {item.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Media & Description */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-[4/3] bg-gray-50 relative">
                {item.imageUrls?.[0] ? (
                  <img 
                    src={item.imageUrls[0]} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={80} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                <TrendingUp className="text-brand-secondary" size={24} />
                <h3 className="text-xl font-bold text-brand-primary">Product Details</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-brand-neutral text-lg leading-relaxed">
                  {item.description}
                </p>
                
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starting Price</p>
                    <div className="flex items-center gap-2 text-brand-primary font-bold">
                      <DollarSign size={16} className="text-brand-secondary" />
                      <span>${item.initialPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                    <div className="flex items-center gap-2 text-brand-primary font-bold">
                      <MapPin size={16} className="text-brand-secondary" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seller</p>
                    <div className="flex items-center gap-2 text-brand-primary font-bold">
                      <UserBadge user={isOwner ? null : item.seller} fallback={isOwner ? 'You (Owner)' : 'Unknown'} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Action */}
          <div className="space-y-8">
            <div className="bg-brand-primary p-8 md:p-10 rounded-[2.5rem] text-brand-white shadow-2xl shadow-brand-primary/20 relative overflow-hidden">
              {isPulse && (
                <div className="absolute inset-0 bg-brand-secondary/20 animate-ping pointer-events-none" />
              )}
              
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">
                      {localBuyer ? 'Current Highest Bid' : 'Starting Price'}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter">
                        ${localCurrentBid.toLocaleString()}
                      </span>
                      <span className="text-xl font-bold opacity-60">USD</span>
                    </div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                    <Gavel size={32} className="text-brand-secondary" />
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <UserBadge user={localBuyer} fallback="No bids yet" className="text-white" />
                </div>

                <form onSubmit={handleBidSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-widest opacity-60 ml-1">Your Bid Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" size={24} />
                      <input
                        type="number"
                        step="0.01"
                        min={localCurrentBid + 0.01}
                        className="w-full bg-white text-brand-primary border-none p-5 pl-12 rounded-3xl font-black text-2xl focus:ring-4 focus:ring-brand-secondary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="0.00"
                        disabled={isProcessing || isOwner || isClosed || !effectiveAuctionId}
                        required
                      />
                    </div>
                  </div>

                  {isOwner && (
                    <div className="bg-blue-500/20 border border-blue-500/50 p-4 rounded-2xl flex items-center gap-3 text-blue-100">
                      <Info size={20} />
                      <p className="text-sm font-bold">You cannot bid on your own auction items.</p>
                    </div>
                  )}

                  {!effectiveAuctionId && (
                    <div className="bg-amber-500/20 border border-amber-500/50 p-4 rounded-2xl flex flex-col gap-2 text-amber-100">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={20} />
                        <p className="text-sm font-bold">Auction Context Missing</p>
                      </div>
                      <p className="text-xs opacity-80">Loading auction details...</p>
                    </div>
                  )}

                  {conflictError && (
                    <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3 text-red-200 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={20} />
                      <p className="text-sm font-bold">{conflictError}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-2xl flex items-center gap-3 text-green-200 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 size={20} />
                      <p className="text-sm font-bold">{successMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing || placeBidMutation.isPending || isOwner || isClosed || !effectiveAuctionId}
                    className="w-full bg-brand-secondary text-brand-primary p-5 rounded-3xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
                  >
                    {isProcessing || placeBidMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>Processing Bid...</span>
                      </>
                    ) : (
                      <span>Place Bid Now</span>
                    )}
                  </button>
                </form>
                
                <p className="text-center text-[10px] font-bold opacity-40 uppercase tracking-widest">
                  Secure checkout powered by Stripe & Verified Partners
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="flex items-center gap-2">
                  <AuctionStatusBadge startTime={auction?.startTime || ''} endTime={auction?.endTime || ''} />
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
              <div className="flex items-center gap-3">
                <History className="text-brand-neutral" size={20} />
                <h3 className="text-lg font-bold text-brand-primary">Bidding Rules</h3>
              </div>
              <ul className="space-y-3 text-sm text-brand-neutral font-medium">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                  <span>Each bid must be at least $1.00 higher than the current bid.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                  <span>Bids are legally binding commitments to purchase.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                  <span>An active payment method is required to place a bid.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    className={`animate-spin ${className}`} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default ItemDetailsPage;
