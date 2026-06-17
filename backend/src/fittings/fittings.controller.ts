import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FittingsService } from './fittings.service';
import { CreateFittingDto } from './dto/create-fitting.dto';
import { UpdateFittingDto } from './dto/update-fitting.dto';

@Controller('fittings')
export class FittingsController {
  constructor(private readonly fittingsService: FittingsService) {}

  @Post()
  create(@Body() createFittingDto: CreateFittingDto) {
    return this.fittingsService.create(createFittingDto);
  }

  @Get()
  findAll(@Query('dressId') dressId?: string) {
    if (dressId) {
      return this.fittingsService.findByDressId(dressId);
    }
    return this.fittingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fittingsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFittingDto: UpdateFittingDto) {
    return this.fittingsService.update(id, updateFittingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fittingsService.remove(id);
  }
}
