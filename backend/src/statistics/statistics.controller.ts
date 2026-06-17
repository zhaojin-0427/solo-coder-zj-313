import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  getOverview() {
    return this.statisticsService.getOverview();
  }

  @Get('dress/:dressId')
  getDressStats(@Param('dressId') dressId: string) {
    return this.statisticsService.getDressStats(dressId);
  }

  @Get('consignment')
  getConsignmentStats() {
    return this.statisticsService.getConsignmentStats();
  }
}
