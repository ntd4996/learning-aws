import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ImageBackgroundService } from '../services/image-background.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/image-backgrounds')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ImageBackgroundController {
  constructor(
    private readonly imageBackgroundService: ImageBackgroundService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a new image background' })
  @ApiResponse({
    status: 201,
    description: 'The image background has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image background file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  create(@UploadedFile() file: Express.Multer.File) {
    return this.imageBackgroundService.create(file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all image backgrounds' })
  @ApiResponse({ status: 200, description: 'Return all image backgrounds.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.imageBackgroundService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an image background by ID' })
  @ApiResponse({ status: 200, description: 'Return the image background.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id') id: string) {
    return this.imageBackgroundService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an image background by ID' })
  @ApiResponse({
    status: 200,
    description: 'The image background has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string) {
    return this.imageBackgroundService.remove(id);
  }
}
