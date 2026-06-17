import { Module, forwardRef } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { ReturnsModule } from '../returns/returns.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [forwardRef(() => ReturnsModule), forwardRef(() => MembersModule)],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
