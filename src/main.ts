import { Logger, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  app.useGlobalInterceptors(new LoggingInterceptor())

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const httpAdapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost))

  await app.listen(parseInt(process.env.APP_PORT), () => {
    Logger.log(`Server is running at port ${process.env.APP_PORT}`)
  })
}
void bootstrap()
