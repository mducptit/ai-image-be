import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const request = ctx.getRequest()

    const httpStatus = this.getStatus(exception)

    const responseBody = {
      statusCode: httpStatus,
      method: request.method,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message: exception?.response?.message || exception.message,
    }

    this.logger.error(JSON.stringify(responseBody))

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }

  getStatus(exception: any): number {
    if (exception instanceof HttpException) return exception.getStatus()
    return HttpStatus.INTERNAL_SERVER_ERROR
  }
}
