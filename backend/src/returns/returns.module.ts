import { Module, forwardRef } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { DisputesModule } from '../disputes/disputes.module';
import { RentalsModule } from '../rentals/rentals.module';
import { OutfitsModule } from '../outfits/outfits.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [forwardRef(() => DisputesModule), forwardRef(() => RentalsModule), forwardRef(() => OutfitsModule), forwardRef(() => MembersModule)],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}
