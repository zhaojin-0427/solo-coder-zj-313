import { Module, forwardRef } from '@nestjs/common';
import { OutfitsService } from './outfits.service';
import { OutfitsController } from './outfits.controller';
import { DressesModule } from '../dresses/dresses.module';
import { RentalsModule } from '../rentals/rentals.module';

@Module({
  imports: [DressesModule, forwardRef(() => RentalsModule)],
  controllers: [OutfitsController],
  providers: [OutfitsService],
  exports: [OutfitsService],
})
export class OutfitsModule {}
