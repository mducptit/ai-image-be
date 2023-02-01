import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { v2 as cloudinary } from 'cloudinary'
import { PrismaService } from '../prisma/prisma.service'
import { Post } from '@prisma/client'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto): Promise<Post> {
    try {
      await cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
      })

      const { photo } = dto

      const photoUrl = await cloudinary.uploader.upload(photo)

      const newPost = await this.prisma.post.create({
        data: {
          ...dto,
          photo: photoUrl.url,
        },
      })

      return newPost
    } catch (e: any) {
      throw new InternalServerErrorException(e)
    }
  }

  async findMany(): Promise<Post[]> {
    try {
      const results = await this.prisma.post.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

      return results
    } catch (e: any) {
      throw new InternalServerErrorException(e)
    }
  }
}
