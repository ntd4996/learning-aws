import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/services/prisma.service';
import { ImageBackground } from '@prisma/client';
import { FileService } from '@/file/services/file.service';

@Injectable()
export class ImageBackgroundService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
  ) {}

  async create(file: Express.Multer.File): Promise<ImageBackground> {
    const originalName = file.originalname.replace(/\s+/g, '_');
    const s3Url = await this.fileService.upload(file.buffer, originalName);

    return this.prisma.imageBackground.create({ data: { url: s3Url } });
  }

  async findAll(): Promise<ImageBackground[]> {
    return this.prisma.imageBackground.findMany();
  }

  async findOne(id: string): Promise<ImageBackground | null> {
    return this.prisma.imageBackground.findUnique({ where: { id } });
  }

  async remove(id: string): Promise<ImageBackground> {
    return this.prisma.imageBackground.delete({ where: { id } });
  }
}
