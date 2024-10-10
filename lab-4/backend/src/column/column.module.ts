import { Module } from '@nestjs/common';
import { ColumnService } from './services/column.service';
import { ColumnController } from './controllers/column.controller';
import { PrismaService } from '@/prisma/services/prisma.service';

@Module({
  imports: [],
  controllers: [ColumnController],
  providers: [ColumnService, PrismaService],
})
export class ColumnModule {}
