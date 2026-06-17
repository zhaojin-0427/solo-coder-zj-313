import { Module } from '@nestjs/common';
import { DressesService } from './dresses.service';
import { DressesController } from './dresses.controller';

@Module({
  controllers: [DressesController],
  providers: [DressesService],
  exports: [DressesService],
})
export class DressesModule {}
