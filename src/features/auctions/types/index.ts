import { ItemDTO } from "@/api/types";

export interface AuctionDTO {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  items: ItemDTO[];
  user: string;
}

export interface AuctionItemUpdateDTO {
  id?: string;
  name: string;
  description: string;
  location: string;
  initialPrice: number;
  imageUrls?: string[];
  legitimacyProof?: string;
  extras?: string;
}

export interface AuctionUpdateDTO {
  name: string;
  startTime: string;
  endTime: string;
  items: AuctionItemUpdateDTO[];
}

export interface ItemCreationDTO {
  name: string;
  description: string;
  location: string;
  initialPrice: number;
  imageUrls?: string[];
  legitimacyProof?: string;
  extras?: string;
}

export interface AuctionCreationDTO {
  name: string;
  startTime: string;
  endTime: string;
  items: ItemCreationDTO[];
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
