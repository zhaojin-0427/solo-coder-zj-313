import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CalculateDepositReductionDto } from './dto/calculate-reduction.dto';
import { RentalsService } from '../rentals/rentals.service';
import { ReturnsService } from '../returns/returns.service';
import { DisputesService } from '../disputes/disputes.service';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    @Inject(forwardRef(() => RentalsService))
    private readonly rentalsService: RentalsService,
    @Inject(forwardRef(() => ReturnsService))
    private readonly returnsService: ReturnsService,
    @Inject(forwardRef(() => DisputesService))
    private readonly disputesService: DisputesService,
  ) {}

  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Get(':id/detail')
  getMemberDetail(@Param('id') id: string) {
    const member = this.membersService.findOne(id);
    const rentals = this.rentalsService.findAll().filter(
      (r) => r.userInfo.phone === member.phone,
    );
    const returns = this.returnsService.findAll().filter(
      (ret) => ret.userName === member.name,
    );
    const disputes = this.disputesService.findAll().filter(
      (d) => d.userName === member.name,
    );
    return {
      member,
      rentals,
      returns,
      disputes,
    };
  }

  @Post('calculate-reduction')
  calculateDepositReduction(@Body() dto: CalculateDepositReductionDto) {
    return this.membersService.calculateDepositReduction(dto);
  }
}
