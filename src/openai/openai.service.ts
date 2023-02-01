import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { Configuration, OpenAIApi } from 'openai'
import { CreateDto } from './dto/create.dto'

@Injectable()
export class OpenaiService {
  private logger = new Logger(OpenaiService.name)

  async create(dto: CreateDto): Promise<string> {
    this.logger.debug(JSON.stringify(dto))
    try {
      const { prompt } = dto

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_KEY,
      })

      const openai = new OpenAIApi(configuration)

      const response = await openai.createImage({
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      })

      const image = response.data.data[0].b64_json

      return image
    } catch (e: any) {
      this.logger.error(e)
      throw new InternalServerErrorException(e)
    }
  }
}
