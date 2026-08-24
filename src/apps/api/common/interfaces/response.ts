import { PaginationMeta } from './pagination';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
  timestamp: string;
}
