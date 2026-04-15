import { useEffect, useState, useRef } from 'react';
import { AuctionUpdateEvent, NotificationEvent } from '@/features/auctions/types';

export const useAuctionStream = (auctionId?: string, enabled: boolean = true) => {
  const [lastEvent, setLastEvent] = useState<AuctionUpdateEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef(0);

  useEffect(() => {
    if (!auctionId || !enabled) {
      setIsConnected(false);
      return;
    }

    let eventSource: EventSource | null = null;

    const connect = () => {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      const sseUrl = `${baseUrl}/auctions/${auctionId}/stream`;
      
      eventSource = new EventSource(sseUrl, { withCredentials: true });

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectAttemptRef.current = 0; // Reset attempts on success
      };

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
        setIsConnected(false);
        
        if (eventSource) {
          eventSource.close();
        }

        // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000);
        console.log(`Reconnecting in ${delay}ms...`);
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectAttemptRef.current += 1;
          connect();
        }, delay);
      };
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [auctionId, enabled]);

  return { lastEvent, isConnected };
};
