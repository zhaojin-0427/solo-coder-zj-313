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
import { ConsignmentsService } from './consignments.service';
import { CreateConsignmentDto } from './dto/create-consignment.dto';
import { UpdateConsignmentDto } from './dto/update-consignment.dto';
import { NegotiateDto } from './dto/negotiate.dto';
import { SettleDto } from './dto/settle.dto';

@Controller('consignments')
export class ConsignmentsController {
  constructor(private readonly consignmentsService: ConsignmentsService) {}

  @Post()
  create(@Body() createConsignmentDto: CreateConsignmentDto) {
    return this.consignmentsService.create(createConsignmentDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    const all = this.consignmentsService.findAll();
    if (status) {
      return all.filter((c) => c.status === status);
    }
    return all;
  }

  @Get('stats')
  getStats() {
    return this.consignmentsService.getConsignmentStats();
  }

  @Get('dress/:dressId')
  findByDressId(@Param('dressId') dressId: string) {
    return this.consignmentsService.findByDressId(dressId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consignmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsignmentDto: UpdateConsignmentDto,
  ) {
    return this.consignmentsService.update(id, updateConsignmentDto);
  }

  @Post(':id/negotiate')
  negotiate(@Param('id') id: string, @Body() negotiateDto: NegotiateDto) {
    return this.consignmentsService.negotiate(id, negotiateDto);
  }

  @Post(':id/complete-sale')
  completeSale(
    @Param('id') id: string,
    @Body() body?: { finalPrice?: number },
  ) {
    return this.consignmentsService.completeSale(id, body?.finalPrice);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.consignmentsService.cancel(id);
  }

  @Post(':id/expire')
  expire(@Param('id') id: string) {
    return this.consignmentsService.expire(id);
  }

  @Post(':id/settle')
  settle(@Param('id') id: string, @Body() settleDto: SettleDto) {
    return this.consignmentsService.settle(id, settleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consignmentsService.remove(id);
  }
}
