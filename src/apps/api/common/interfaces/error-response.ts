export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorCode?: string;
  timestamp: string;
  path?: string;
}
