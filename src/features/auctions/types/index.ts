import { ItemDTO } from "@/api/types";

export interface AuctionDTO {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  items: ItemDTO[];
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
