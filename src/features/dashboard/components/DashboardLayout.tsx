import React from 'react';
import { ActiveAuctionsList } from './ActiveAuctionsList';
import { PopularItemsGallery } from './PopularItemsGallery';
import { PastAuctionsSection } from './PastAuctionsSection';
import { Activity } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Popular Items - Hero Style */}
      <section className="space-y-6">
        <PopularItemsGallery />
      </section>

      {/* Active Auctions Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="bg-brand-primary p-2 rounded-xl text-brand-white shadow-lg shadow-brand-primary/20">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight">Live Auctions</h2>
            <p className="text-brand-neutral font-medium">Bidding is active. Join now to secure your items.</p>
          </div>
        </div>
        <ActiveAuctionsList />
      </section>

      {/* Past Auctions Section */}
      <section className="pt-12 border-t border-gray-100">
        <PastAuctionsSection />
      </section>
    </div>
  );
};
