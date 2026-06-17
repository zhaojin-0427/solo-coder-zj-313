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
import { DressesService } from './dresses.service';
import { CreateDressDto } from './dto/create-dress.dto';
import { UpdateDressDto } from './dto/update-dress.dto';

@Controller('dresses')
export class DressesController {
  constructor(private readonly dressesService: DressesService) {}

  @Post()
  create(@Body() createDressDto: CreateDressDto) {
    return this.dressesService.create(createDressDto);
  }

  @Get()
  findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (startDate && endDate) {
      return this.dressesService.findAvailable(startDate, endDate);
    }
    return this.dressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dressesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDressDto: UpdateDressDto) {
    return this.dressesService.update(id, updateDressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dressesService.remove(id);
  }
}
