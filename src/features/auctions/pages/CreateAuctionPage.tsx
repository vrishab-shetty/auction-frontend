import React, { useState } from 'react';
import { useCreateAuction } from '../hooks/useCreateAuction';
import { AuctionCreationDTO, ItemCreationDTO } from '../types';
import { extractFieldErrors } from '@/utils/errorUtils';
import { Navbar } from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, Trash2, Package, Gavel, Info } from 'lucide-react';

const CreateAuctionPage: React.FC = () => {
  const createMutation = useCreateAuction();
  const navigate = useNavigate();
  
  // Set default start time to tomorrow at the same time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
  const defaultStartTime = tomorrow.toISOString().slice(0, 16);

  // Set default end time to 2 days from now
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setMinutes(dayAfterTomorrow.getMinutes() - dayAfterTomorrow.getTimezoneOffset());
  const defaultEndTime = dayAfterTomorrow.toISOString().slice(0, 16);

  const [auctionData, setAuctionData] = useState({
    name: '',
    startTime: defaultStartTime,
    endTime: defaultEndTime,
  });

  const [items, setItems] = useState<ItemCreationDTO[]>([
    { name: '', description: '', location: '', initialPrice: 0, imageUrls: [], legitimacyProof: '', extras: '' }
  ]);

  const handleAuctionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAuctionData({ ...auctionData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newItems = [...items];
    const { name, value } = e.target;
    
    if (name === 'initialPrice') {
      newItems[index] = { ...newItems[index], [name]: parseFloat(value) || 0 };
    } else {
      newItems[index] = { ...newItems[index], [name]: value };
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', description: '', location: '', initialPrice: 0, imageUrls: [], legitimacyProof: '', extras: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final Validation
    const start = new Date(auctionData.startTime);
    const end = new Date(auctionData.endTime);
    const now = new Date();
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(now.getDate() + 1);

    if (start < oneDayFromNow) {
      alert('Auction must be scheduled at least 24 hours in advance.');
      return;
    }

    if (end <= start) {
      alert('End time must be after start time.');
      return;
    }

    const payload: AuctionCreationDTO = {
      name: auctionData.name,
      startTime: new Date(auctionData.startTime).toISOString(),
      endTime: new Date(auctionData.endTime).toISOString(),
      items: items
    };

    createMutation.mutate(payload);
  };

  const errors = extractFieldErrors(createMutation.error);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-4xl mx-auto p-4 md:p-8 pt-10 space-y-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-brand-neutral"
            title="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-brand-primary tracking-tight">Schedule New Auction</h1>
            <p className="text-brand-neutral font-medium">Configure your event and list your exclusive items.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Auction Details Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
              <Gavel className="text-brand-secondary" size={20} />
              <h3 className="text-lg font-bold text-brand-primary">Event Information</h3>
            </div>

            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                <p className="text-red-700 font-medium text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Auction Title</label>
                <input
                  name="name"
                  type="text"
                  placeholder="e.g. Modern Art Collection 2026"
                  className={`w-full border-2 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-bold text-brand-primary ${errors.name ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50/50'}`}
                  value={auctionData.name}
                  onChange={handleAuctionChange}
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
                      name="startTime"
                      type="datetime-local"
                      min={defaultStartTime} // Prevent selecting past or too early dates
                      className="w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all bg-gray-50/50 font-medium"
                      value={auctionData.startTime}
                      onChange={handleAuctionChange}
                      required
                    />
                  </div>
                  <p className="flex items-center gap-1 text-[10px] text-brand-neutral mt-1 ml-1 font-medium">
                    <Info size={12} />
                    Minimum 24h from now
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">End Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      name="endTime"
                      type="datetime-local"
                      min={auctionData.startTime} // Prevent selecting end time before start time
                      className="w-full border-2 pl-12 p-4 rounded-2xl focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all bg-gray-50/50 font-medium"
                      value={auctionData.endTime}
                      onChange={handleAuctionChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Items Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="bg-brand-secondary/20 p-2 rounded-lg text-brand-secondary">
                  <Package size={24} />
                </div>
                <h2 className="text-2xl font-extrabold text-brand-primary tracking-tight">Auction Items</h2>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 text-brand-secondary hover:text-brand-primary font-bold text-sm transition-colors"
              >
                <Plus size={18} />
                Add Another Item
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 relative animate-in slide-in-from-right-4 duration-300">
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Item Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Product name"
                      className="w-full border-2 p-4 rounded-2xl border-gray-50 bg-gray-50/50 focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-bold"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Initial Price ($)</label>
                    <input
                      name="initialPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border-2 p-4 rounded-2xl border-gray-50 bg-gray-50/50 focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-bold"
                      value={item.initialPrice}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Detailed item description..."
                      className="w-full border-2 p-4 rounded-2xl border-gray-50 bg-gray-50/50 focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-medium"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                    <input
                      name="location"
                      type="text"
                      placeholder="Storage facility location"
                      className="w-full border-2 p-4 rounded-2xl border-gray-50 bg-gray-50/50 focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-medium"
                      value={item.location}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Legitimacy Proof URL</label>
                    <input
                      name="legitimacyProof"
                      type="text"
                      placeholder="Link to certificate or proof"
                      className="w-full border-2 p-4 rounded-2xl border-gray-50 bg-gray-50/50 focus:ring-4 focus:ring-brand-secondary/10 focus:border-brand-secondary outline-none transition-all font-medium"
                      value={item.legitimacyProof}
                      onChange={(e) => handleItemChange(index, e)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 bg-brand-primary text-brand-white p-5 rounded-3xl font-black text-lg shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
              {createMutation.isPending ? 'Scheduling Auction...' : 'Initialize Auction Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-10 py-5 rounded-3xl font-bold text-brand-neutral hover:bg-gray-100 transition-colors border-2 border-transparent"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateAuctionPage;
