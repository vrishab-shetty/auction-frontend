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
