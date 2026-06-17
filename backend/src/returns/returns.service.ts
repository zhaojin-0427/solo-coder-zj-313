import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { ReturnRecord } from './entities/return.entity';

@Injectable()
export class ReturnsService {
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

    const newReturn: ReturnRecord = {
      id: Date.now().toString(),
      ...createReturnDto,
      notes: createReturnDto.notes || '',
      dressId: '',
      dressName: '',
      userName: '',
      expectedReturnDate: '',
      isLate: false,
      lateDays: 0,
      lateFee: 0,
      accessoriesComplete,
      totalAccessoriesDeduction,
      totalDamageDeduction,
      depositAmount: 0,
      totalDeduction: totalAccessoriesDeduction + totalDamageDeduction + createReturnDto.cleaningCost,
      refundAmount: 0,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.returns.push(newReturn);
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
}
