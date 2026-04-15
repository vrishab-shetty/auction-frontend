import React from 'react';
import { ItemDTO } from '@/api/types';
import { AuctionItemDTO } from '@/features/auctions/types';
import { MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ItemCardProps {
  item: ItemDTO | AuctionItemDTO;
  auctionId?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, auctionId: manualAuctionId }) => {
  // item.auctionId exists on ItemDTO, but not on AuctionItemDTO (where it's implied by the context)
  const effectiveAuctionId = manualAuctionId || (item as ItemDTO).auctionId;
  
  // Starting price can be initialPrice (ItemDTO) or startingBid (AuctionItemDTO)
  const startingPrice = (item as ItemDTO).initialPrice ?? (item as AuctionItemDTO).startingBid;

  const CardContent = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300 h-full">
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {item.imageUrls?.[0] ? (
          <img 
            src={item.imageUrls[0]} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <TrendingUp size={48} />
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h4 className="font-bold text-brand-primary group-hover:text-brand-secondary transition-colors line-clamp-1">
            {item.name}
          </h4>
          <div className="flex items-center gap-1 text-xs text-brand-neutral mt-1">
            <MapPin size={12} />
            <span>{item.location}</span>
          </div>
        </div>

        <div className="flex justify-between items-end pt-2 border-t border-gray-50">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starting At</p>
            <div className="flex items-center text-brand-primary font-bold">
              <DollarSign size={14} />
              <span>{startingPrice}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Bid</p>
            <div className="flex items-center justify-end text-brand-secondary font-black text-lg">
              {item.currentBid ? (
                <>
                  <DollarSign size={16} />
                  <span>{item.currentBid}</span>
                </>
              ) : (
                <span className="text-sm text-gray-400 font-bold">No bids yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (effectiveAuctionId) {
    return (
      <Link to={`/auctions/${effectiveAuctionId}/items/${item.id}`} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return (
    <Link to={`/items/${item.id}`} className="block h-full">
      {CardContent}
    </Link>
  );
};
