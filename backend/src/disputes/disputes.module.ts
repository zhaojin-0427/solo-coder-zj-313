import { Module, forwardRef } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { ReturnsModule } from '../returns/returns.module';

@Module({
  imports: [forwardRef(() => ReturnsModule)],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
