export interface AuctionItemDTO {
  id: string;
  name: string;
  description: string;
  location: string;
  initialPrice: number;
  currentBid?: number;
  imageUrls?: string[];
  legitimacyProof?: string;
  extras?: string;
  buyer?: string;
}

export interface AuctionDTO {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  items: AuctionItemDTO[];
  user: string;
}

export interface AuctionUpdateEvent {
  auctionId: string;
  itemId: string;
  currentBid: number;
  bidCount: number;
  highestBidder: string;
}

export interface NotificationEvent<T> {
  type: string;
  data: T;
}
