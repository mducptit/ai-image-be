import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { PostModule } from './post/post.module'
import { OpenaiModule } from './openai/openai.module'

@Module({
  imports: [PrismaModule, PostModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
