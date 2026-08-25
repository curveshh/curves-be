import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const error = exception instanceof HttpException ? exception.getResponse() : null;

    response.status(status).json({
      success: false,

      statusCode: status,

      message: typeof error === 'string' ? error : (error?.['message'] ?? 'Internal server error'),

      timestamp: new Date().toISOString(),

      path: request.url,
    });
  }
}
