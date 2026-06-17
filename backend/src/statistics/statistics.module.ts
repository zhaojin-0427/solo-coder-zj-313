import { Module, forwardRef } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { DressesModule } from '../dresses/dresses.module';
import { RentalsModule } from '../rentals/rentals.module';
import { ReturnsModule } from '../returns/returns.module';
import { FittingsModule } from '../fittings/fittings.module';
import { DisputesModule } from '../disputes/disputes.module';
import { OutfitsModule } from '../outfits/outfits.module';
import { ConsignmentsModule } from '../consignments/consignments.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    DressesModule,
    forwardRef(() => RentalsModule),
    forwardRef(() => ReturnsModule),
    FittingsModule,
    forwardRef(() => DisputesModule),
    forwardRef(() => OutfitsModule),
    ConsignmentsModule,
    forwardRef(() => MembersModule),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
