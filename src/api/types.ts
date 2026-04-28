export interface Result<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  isDeleted: boolean;
}

export interface ItemDTO {
  id: string;
  name: string;
  description: string;
  location: string;
  initialPrice: number;
  currentBid?: number;
  imageUrls?: string[];
  legitimacyProof?: string;
  extras?: string;
  buyer?: UserSummary | null;
  seller: UserSummary;
  auctionId?: string;
}
