import { Module } from '@nestjs/common';
import { FittingsService } from './fittings.service';
import { FittingsController } from './fittings.controller';

@Module({
  controllers: [FittingsController],
  providers: [FittingsService],
  exports: [FittingsService],
})
export class FittingsModule {}
