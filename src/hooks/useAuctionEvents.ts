import { useEffect, useState } from 'react';
import { AuctionUpdateEvent, NotificationEvent } from '@/features/auctions/types';

export const useAuctionEvents = (auctionId?: string) => {
  const [lastEvent, setLastEvent] = useState<AuctionUpdateEvent | null>(null);

  useEffect(() => {
    if (!auctionId) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    const sseUrl = `${baseUrl}/auctions/${auctionId}/stream`;
    
    const eventSource = new EventSource(sseUrl, { withCredentials: true });

    eventSource.addEventListener('BID_UPDATE', (event) => {
      try {
        const notification: NotificationEvent<AuctionUpdateEvent> = JSON.parse(event.data);
        setLastEvent(notification.data);
      } catch (err) {
        console.error('Failed to parse BID_UPDATE event:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [auctionId]);

  return lastEvent;
};
