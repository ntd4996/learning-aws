import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserImageBackgroundDto } from '../dtos/update-user-image-background.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('users')
@Controller('api/users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Patch('update-image-background')
  @ApiOperation({ summary: 'Update image background for the logged-in user' })
  @ApiResponse({
    status: 201,
    description: 'The image background has been successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({
    type: UpdateUserImageBackgroundDto,
    description: 'Data to update the image background',
  })
  updateImageBackground(
    @Req() req: Request,
    @Body() updateUserImageBackgroundDto: UpdateUserImageBackgroundDto,
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token) as { sub: string };

    if (!decodedToken || !decodedToken.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.sub;
    return this.userService.updateImageBackground(
      userId,
      updateUserImageBackgroundDto.imageBackgroundId,
    );
  }

  @Get('get-image-background')
  @ApiOperation({ summary: 'Get image background for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'The image background has been successfully retrieved.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getImageBackground(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = this.jwtService.decode(token) as { sub: string };

    if (!decodedToken || !decodedToken.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.sub;
    return this.userService.getImageBackground(userId);
  }
}
