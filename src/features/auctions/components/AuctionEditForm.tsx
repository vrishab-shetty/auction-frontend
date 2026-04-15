import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import auctionService from '../api/auctionService';
import { AuctionDTO, AuctionUpdateDTO } from '../types';
import { extractFieldErrors } from '@/utils/errorUtils';
import { X, Calendar, Edit3, Info } from 'lucide-react';

interface AuctionEditFormProps {
  auction: AuctionDTO;
  onClose: () => void;
}

export const AuctionEditForm: React.FC<AuctionEditFormProps> = ({ auction, onClose }) => {
  const queryClient = useQueryClient();
  
  // Helper to convert UTC string to Local ISO string for datetime-local input
  const toLocalISOString = (dateStr: string) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  const localOriginalStartTime = toLocalISOString(auction.startTime);
  
  const [formData, setFormData] = useState<AuctionUpdateDTO>({
    name: auction.name,
    startTime: auction.startTime,
    endTime: auction.endTime,
    items: auction.items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      location: item.location,
      initialPrice: item.startingBid,
      imageUrls: item.imageUrls || [],
      legitimacyProof: '', // Not provided in AuctionItemDTO
      extras: '' // Not provided in AuctionItemDTO
    }))
  });

  const mutation = useMutation({
    mutationFn: (data: AuctionUpdateDTO) => auctionService.updateAuction(auction.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', auction.id] });
      alert('Auction updated successfully');
      onClose();
    },
  });

  const handleDateChange = (field: 'startTime' | 'endTime', localValue: string) => {
    // Convert local datetime-local value back to UTC ISO string for the backend
    const utcValue = new Date(localValue).toISOString();
    setFormData(prev => ({ ...prev, [field]: utcValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    
    if (end <= start) {
      alert('End time must be after start time.');
      return;
    }

    mutation.mutate(formData);
  };

  const errors = extractFieldErrors(mutation.error);

  return (
    <div className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300">
        <div className="bg-brand-primary p-6 text-brand-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Edit3 size={20} />
            </div>
            <h3 className="text-xl font-bold">Edit Auction</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          {errors.general && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
              <p className="text-red-700 font-medium">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Auction Title</label>
              <input
                type="text"
                className={`w-full border-2 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-bold text-brand-primary ${errors.name ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50'}`}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {errors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Start Time</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="datetime-local"
                    min={localOriginalStartTime}
                    className="w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all bg-gray-50/50 font-medium"
                    value={toLocalISOString(formData.startTime)}
                    onChange={e => handleDateChange('startTime', e.target.value)}
                    required
                  />
                </div>
                <p className="flex items-center gap-1 text-[10px] text-brand-neutral mt-1 ml-1 font-medium">
                  <Info size={12} />
                  Must be no earlier than {new Date(auction.startTime).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">End Time</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="datetime-local"
                    min={toLocalISOString(formData.startTime)}
                    className="w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all bg-gray-50/50 font-medium"
                    value={toLocalISOString(formData.endTime)}
                    onChange={e => handleDateChange('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-brand-primary text-brand-white p-4 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
            >
              {mutation.isPending ? 'Saving Changes...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors border border-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
