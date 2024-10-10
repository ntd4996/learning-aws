import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateImageBackground(
    userId: string,
    imageBackgroundId: string,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { imageBackgroundId },
    });
  }

  async getImageBackground(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { imageBackgroundId: true },
    });

    if (!user || !user.imageBackgroundId) {
      return {};
    }

    const imageBackground = await this.prisma.imageBackground.findUnique({
      where: { id: user.imageBackgroundId },
    });

    return imageBackground || {};
  }
}
