import { Module, forwardRef } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { RentalsModule } from '../rentals/rentals.module';
import { ReturnsModule } from '../returns/returns.module';
import { DisputesModule } from '../disputes/disputes.module';

@Module({
  imports: [
    forwardRef(() => RentalsModule),
    forwardRef(() => ReturnsModule),
    forwardRef(() => DisputesModule),
  ],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
