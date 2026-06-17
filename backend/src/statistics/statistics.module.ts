import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { DressesModule } from '../dresses/dresses.module';
import { RentalsModule } from '../rentals/rentals.module';
import { ReturnsModule } from '../returns/returns.module';
import { FittingsModule } from '../fittings/fittings.module';

@Module({
  imports: [DressesModule, RentalsModule, ReturnsModule, FittingsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
