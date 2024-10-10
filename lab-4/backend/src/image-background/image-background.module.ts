import { Module } from '@nestjs/common';
import { ImageBackgroundService } from './services/image-background.service';
import { ImageBackgroundController } from './controllers/image-background.controller';
import { PrismaService } from '@/prisma/services/prisma.service';
import { FileModule } from '@/file/file.module';

@Module({
  imports: [FileModule],
  controllers: [ImageBackgroundController],
  providers: [ImageBackgroundService, PrismaService],
})
export class ImageBackgroundModule {}
