import { Module } from '@nestjs/common';
import { ConsignmentsService } from './consignments.service';
import { ConsignmentsController } from './consignments.controller';
import { DressesModule } from '../dresses/dresses.module';

@Module({
  imports: [DressesModule],
  controllers: [ConsignmentsController],
  providers: [ConsignmentsService],
  exports: [ConsignmentsService],
})
export class ConsignmentsModule {}
