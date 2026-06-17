import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto, ReviewDisputeDto } from './dto/create-dispute.dto';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  create(@Body() createDisputeDto: CreateDisputeDto) {
    return this.disputesService.create(createDisputeDto);
  }

  @Get()
  findAll(@Query('returnId') returnId?: string, @Query('reviewStatus') reviewStatus?: string) {
    if (returnId) {
      return this.disputesService.findByReturnId(returnId);
    }
    if (reviewStatus) {
      return this.disputesService.findByReviewStatus(reviewStatus);
    }
    return this.disputesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disputesService.findOne(id);
  }

  @Patch(':id/review')
  review(@Param('id') id: string, @Body() reviewDisputeDto: ReviewDisputeDto) {
    return this.disputesService.review(id, reviewDisputeDto);
  }
}
