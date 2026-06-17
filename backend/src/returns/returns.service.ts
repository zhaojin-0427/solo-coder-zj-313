import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ReturnRecord } from './entities/return.entity';
import { DisputesService } from '../disputes/disputes.service';
import { RentalsService } from '../rentals/rentals.service';

@Injectable()
export class ReturnsService {
  constructor(
    @Inject(forwardRef(() => DisputesService))
    private readonly disputesService: DisputesService,
    private readonly rentalsService: RentalsService,
  ) {}
  private returns: ReturnRecord[] = [
    {
      id: '1',
      rentalId: '1',
      dressId: '2',
      dressName: 'Baby, the Stars 玫瑰庭园 OP',
      userName: '小美',
      returnDate: '2026-06-23',
      expectedReturnDate: '2026-06-22',
      isLate: true,
      lateDays: 1,
      lateFee: 120,
      accessories: [
        {
          name: '原配头纱',
          expectedQuantity: 1,
          actualQuantity: 1,
          condition: '完好',
          isComplete: true,
          deductionAmount: 0,
        },
        {
          name: '蕾丝手套',
          expectedQuantity: 1,
          actualQuantity: 1,
          condition: '轻微泛黄',
          isComplete: true,
          deductionAmount: 0,
        },
      ],
      accessoriesComplete: true,
      totalAccessoriesDeduction: 0,
      damages: [],
      totalDamageDeduction: 0,
      cleaningStatus: 'needs_cleaning',
      cleaningCost: 50,
      depositAmount: 800,
      totalDeduction: 170,
      refundAmount: 630,
      notes: '归还晚了一天，裙子整体状况良好，需要常规清洗',
      inspector: '管理员小王',
      status: 'completed',
      createdAt: '2026-06-23',
    },
    {
      id: '2',
      rentalId: '2',
      dressId: '1',
      dressName: 'Angelic Pretty 云境花影 JSK',
      userName: '玲玲',
      returnDate: '2026-07-07',
      expectedReturnDate: '2026-07-07',
      isLate: false,
      lateDays: 0,
      lateFee: 0,
      accessories: [
        {
          name: '原配发带',
          expectedQuantity: 1,
          actualQuantity: 1,
          condition: '完好',
          isComplete: true,
          deductionAmount: 0,
        },
        {
          name: '蝴蝶结胸针',
          expectedQuantity: 2,
          actualQuantity: 1,
          condition: '完好',
          isComplete: false,
          deductionAmount: 50,
        },
      ],
      accessoriesComplete: false,
      totalAccessoriesDeduction: 50,
      damages: [
        {
          location: '裙摆内侧',
          description: '新增小污渍',
          severity: 'minor',
          isNew: true,
          deductionAmount: 30,
        },
      ],
      totalDamageDeduction: 30,
      cleaningStatus: 'needs_professional_cleaning',
      cleaningCost: 80,
      depositAmount: 500,
      totalDeduction: 160,
      refundAmount: 340,
      notes: '遗失一个蝴蝶结胸针，裙摆有轻微污渍需要专业清洗',
      inspector: '管理员小李',
      status: 'completed',
      createdAt: '2026-07-07',
    },
  ];

  create(createReturnDto: CreateReturnDto): ReturnRecord {
    const rental = this.rentalsService.findOne(createReturnDto.rentalId);

    const totalAccessoriesDeduction = createReturnDto.accessories.reduce(
      (sum, acc) => sum + acc.deductionAmount,
      0,
    );
    const totalDamageDeduction = createReturnDto.damages.reduce(
      (sum, dmg) => sum + dmg.deductionAmount,
      0,
    );
    const accessoriesComplete = createReturnDto.accessories.every(
      (acc) => acc.isComplete,
    );

    const returnDate = new Date(createReturnDto.returnDate);
    const expectedReturnDate = new Date(rental.endDate);
    const lateDays = Math.max(
      0,
      Math.ceil((returnDate.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24)),
    );
    const isLate = lateDays > 0;
    const lateFee = createReturnDto.lateFee ?? (lateDays * 30);

    const totalDeduction =
      totalAccessoriesDeduction +
      totalDamageDeduction +
      createReturnDto.cleaningCost +
      lateFee;
    const refundAmount = Math.max(0, rental.deposit - totalDeduction);

    const newReturn: ReturnRecord = {
      id: Date.now().toString(),
      rentalId: createReturnDto.rentalId,
      dressId: rental.dressId,
      dressName: rental.dressName,
      userName: rental.userInfo.name,
      returnDate: createReturnDto.returnDate,
      expectedReturnDate: rental.endDate,
      isLate,
      lateDays,
      lateFee,
      accessories: createReturnDto.accessories,
      accessoriesComplete,
      totalAccessoriesDeduction,
      damages: createReturnDto.damages,
      totalDamageDeduction,
      cleaningStatus: createReturnDto.cleaningStatus,
      cleaningCost: createReturnDto.cleaningCost,
      depositAmount: rental.deposit,
      totalDeduction,
      refundAmount,
      notes: createReturnDto.notes || '',
      inspector: createReturnDto.inspector,
      status: 'completed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.returns.push(newReturn);

    const dispute = this.disputesService.checkAndCreateDispute(
      newReturn,
      createReturnDto.customerNote,
      createReturnDto.staffNote,
    );
    if (dispute) {
      newReturn.status = 'disputed';
    }

    return newReturn;
  }

  findAll(): ReturnRecord[] {
    return this.returns;
  }

  findOne(id: string): ReturnRecord {
    const returnRecord = this.returns.find((r) => r.id === id);
    if (!returnRecord) {
      throw new NotFoundException(`Return record with id ${id} not found`);
    }
    return returnRecord;
  }

  findByRentalId(rentalId: string): ReturnRecord | undefined {
    return this.returns.find((r) => r.rentalId === rentalId);
  }

  update(id: string, updateReturnDto: UpdateReturnDto): ReturnRecord {
    const returnIndex = this.returns.findIndex((r) => r.id === id);
    if (returnIndex === -1) {
      throw new NotFoundException(`Return record with id ${id} not found`);
    }

    const updated = {
      ...this.returns[returnIndex],
      ...updateReturnDto,
    };

    if (updateReturnDto.accessories) {
      updated.totalAccessoriesDeduction = updateReturnDto.accessories.reduce(
        (sum, acc) => sum + acc.deductionAmount,
        0,
      );
      updated.accessoriesComplete = updateReturnDto.accessories.every(
        (acc) => acc.isComplete,
      );
    }

    if (updateReturnDto.damages) {
      updated.totalDamageDeduction = updateReturnDto.damages.reduce(
        (sum, dmg) => sum + dmg.deductionAmount,
        0,
      );
    }

    updated.totalDeduction =
      updated.totalAccessoriesDeduction +
      updated.totalDamageDeduction +
      updated.cleaningCost +
      updated.lateFee;

    updated.refundAmount = updated.depositAmount - updated.totalDeduction;

    const dispute = this.disputesService.checkAndCreateDispute(updated);
    if (dispute) {
      updated.status = 'disputed';
    }

    this.returns[returnIndex] = updated;
    return this.returns[returnIndex];
  }

  remove(id: string): void {
    const returnIndex = this.returns.findIndex((r) => r.id === id);
    if (returnIndex === -1) {
      throw new NotFoundException(`Return record with id ${id} not found`);
    }
    this.returns.splice(returnIndex, 1);
  }

  updateRefundFromDispute(
    returnId: string,
    newRefundAmount: number,
    reviewStatus: 'pending' | 'approved' | 'rejected',
  ): ReturnRecord {
    const returnIndex = this.returns.findIndex((r) => r.id === returnId);
    if (returnIndex === -1) {
      throw new NotFoundException(`Return record with id ${returnId} not found`);
    }

    const returnRecord = this.returns[returnIndex];
    returnRecord.refundAmount = newRefundAmount;
    returnRecord.totalDeduction = returnRecord.depositAmount - newRefundAmount;

    if (reviewStatus === 'approved' || reviewStatus === 'rejected') {
      returnRecord.status = 'completed';
    } else if (reviewStatus === 'pending') {
      returnRecord.status = 'disputed';
    }

    this.returns[returnIndex] = returnRecord;
    return returnRecord;
  }
}
