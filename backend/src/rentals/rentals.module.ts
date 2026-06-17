import { Module, forwardRef } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { DressesModule } from '../dresses/dresses.module';
import { FittingsModule } from '../fittings/fittings.module';
import { OutfitsModule } from '../outfits/outfits.module';
import { ConsignmentsModule } from '../consignments/consignments.module';

@Module({
  imports: [DressesModule, forwardRef(() => FittingsModule), forwardRef(() => OutfitsModule), forwardRef(() => ConsignmentsModule)],
  controllers: [RentalsController],
  providers: [RentalsService],
  exports: [RentalsService],
})
export class RentalsModule {}
