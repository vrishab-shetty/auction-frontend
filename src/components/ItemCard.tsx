import React from 'react';
import { ItemDTO } from '@/api/types';
import { MapPin, TrendingUp, DollarSign } from 'lucide-react';

interface ItemCardProps {
  item: ItemDTO;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
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
        <div className="absolute top-4 left-4 bg-brand-secondary text-brand-primary text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
          Popular
        </div>
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
              <span>{item.initialPrice}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Bid</p>
            <div className="flex items-center justify-end text-brand-secondary font-black text-lg">
              <DollarSign size={16} />
              <span>{item.currentBid || item.initialPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
