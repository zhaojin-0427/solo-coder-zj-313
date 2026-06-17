import { Module, forwardRef } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { DressesModule } from '../dresses/dresses.module';
import { FittingsModule } from '../fittings/fittings.module';

@Module({
  imports: [DressesModule, forwardRef(() => FittingsModule)],
  controllers: [RentalsController],
  providers: [RentalsService],
  exports: [RentalsService],
})
export class RentalsModule {}
