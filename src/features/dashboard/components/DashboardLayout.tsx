import React from 'react';
import { ActiveAuctionsList } from './ActiveAuctionsList';
import { PopularItemsGallery } from './PopularItemsGallery';
import { PastAuctionsSection } from './PastAuctionsSection';
import { UpcomingAuctionsSection } from './UpcomingAuctionsSection';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="space-y-20 pb-20 animate-in fade-in duration-700">
      {/* Trending Now Section */}
      <section>
        <PopularItemsGallery />
      </section>

      {/* Active Auctions Section */}
      <section>
        <ActiveAuctionsList />
      </section>

      {/* Upcoming Auctions Section */}
      <section>
        <UpcomingAuctionsSection />
      </section>

      {/* Past Auctions Section */}
      <section>
        <PastAuctionsSection />
      </section>
    </div>
  );
};
