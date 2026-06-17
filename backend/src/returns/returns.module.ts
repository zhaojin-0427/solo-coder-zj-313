import { Module, forwardRef } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { DisputesModule } from '../disputes/disputes.module';
import { RentalsModule } from '../rentals/rentals.module';

@Module({
  imports: [forwardRef(() => DisputesModule), RentalsModule],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {}
