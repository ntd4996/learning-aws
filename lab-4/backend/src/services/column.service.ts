import { Injectable } from '@nestjs/common';
import { Column, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

@Injectable()
export class ColumnService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ColumnCreateInput): Promise<Column> {
    return this.prisma.column.create({ data });
  }

  async findAll(): Promise<Column[]> {
    return this.prisma.column.findMany();
  }

  async findOne(id: string): Promise<Column | null> {
    return this.prisma.column.findUnique({
      where: { id: id },
    });
  }

  async update(id: string, data: Prisma.ColumnUpdateInput): Promise<Column> {
    return this.prisma.column.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Column> {
    return this.prisma.column.delete({ where: { id } });
  }
}
