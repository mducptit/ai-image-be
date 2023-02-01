import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { map, Observable } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('LoggingInterceptor')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest() as Request
    const res = ctx.getResponse() as Response
    const {
      originalUrl,
      method,
      params,
      query,
      body,
      headers,
      route: { path },
    } = req
    const now = Date.now()

    const excludePaths = []

    const request = {
      headers: {
        ...(headers || {}),
      },
      originalUrl,
      method,
      params,
      query,
      body,
    }

    this.logger.log(JSON.stringify(request))

    return next.handle().pipe(
      map((data) => {
        if (excludePaths.includes(path)) return data

        const response = {
          statusCode: res?.statusCode || 500,
          data,
          duration: `${Date.now() - now}ms`,
        }

        this.logger.log(JSON.stringify(response))
        return response
      }),
    )
  }
}
