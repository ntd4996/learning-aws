import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ColumnService } from '../services/column.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/columns')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new column' })
  @ApiResponse({
    status: 201,
    description: 'The column has been successfully created.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(@Body() createColumnDto: Prisma.ColumnCreateInput) {
    return this.columnService.create(createColumnDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all columns' })
  @ApiResponse({ status: 200, description: 'Return all columns.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.columnService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a column by ID' })
  @ApiResponse({ status: 200, description: 'Return the column.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id') id: string) {
    return this.columnService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a column by ID' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully updated.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(
    @Param('id') id: string,
    @Body() updateColumnDto: Prisma.ColumnUpdateInput,
  ) {
    return this.columnService.update(id, updateColumnDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a column by ID' })
  @ApiResponse({
    status: 200,
    description: 'The column has been successfully deleted.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string) {
    return this.columnService.remove(id);
  }
}
