export interface CursorResult<T> {
  data: T[];
  nextCursor?: string;
  hasNextPage: boolean;
}
