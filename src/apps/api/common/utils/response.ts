import { ApiResponse } from '../interfaces/response';

export class ResponseUtil {
  static success<T>(data: T, meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      meta,
      timestamp: new Date().toISOString(),
    };
  }
}
