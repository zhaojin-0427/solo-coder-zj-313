import { Module } from '@nestjs/common';
import { DressesModule } from './dresses/dresses.module';
import { RentalsModule } from './rentals/rentals.module';
import { FittingsModule } from './fittings/fittings.module';
import { ReturnsModule } from './returns/returns.module';
import { DisputesModule } from './disputes/disputes.module';
import { StatisticsModule } from './statistics/statistics.module';
import { OutfitsModule } from './outfits/outfits.module';
import { ConsignmentsModule } from './consignments/consignments.module';

@Module({
  imports: [
    DressesModule,
    RentalsModule,
    FittingsModule,
    ReturnsModule,
    DisputesModule,
    StatisticsModule,
    OutfitsModule,
    ConsignmentsModule,
  ],
})
export class AppModule {}
