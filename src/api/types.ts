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
  buyer?: string;
  seller?: string;
  popularity?: number;
}
