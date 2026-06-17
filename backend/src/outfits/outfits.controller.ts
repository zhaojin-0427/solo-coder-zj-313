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
import { OutfitsService } from './outfits.service';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';

@Controller('outfits')
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

  @Post()
  create(@Body() createOutfitDto: CreateOutfitDto) {
    return this.outfitsService.create(createOutfitDto);
  }

  @Get()
  findAll() {
    return this.outfitsService.findAll();
  }

  @Get('available')
  findAvailable(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.outfitsService.findAvailable(startDate, endDate);
  }

  @Get('stats')
  getStats() {
    return this.outfitsService.getOutfitStats();
  }

  @Get('scenario-stats')
  getScenarioStats() {
    return this.outfitsService.getScenarioStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.outfitsService.findOne(id);
  }

  @Get(':id/availability')
  checkAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.outfitsService.checkAvailability(id, startDate, endDate);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOutfitDto: UpdateOutfitDto,
  ) {
    return this.outfitsService.update(id, updateOutfitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outfitsService.remove(id);
  }
}
