import { Body, Controller, Post } from '@nestjs/common'
import { CreateDto } from './dto/create.dto'
import { OpenaiService } from './openai.service'

@Controller('generate')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post()
  create(@Body() dto: CreateDto) {
    return this.openaiService.create(dto)
  }
}
