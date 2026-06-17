import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { CreateDisputeDto, ReviewDisputeDto } from './dto/create-dispute.dto';
import { DisputeRecord, DisputeTriggerReason, DeductionDetail } from './entities/dispute.entity';
import { ReturnsService } from '../returns/returns.service';

@Injectable()
export class DisputesService {
  constructor(
    @Inject(forwardRef(() => ReturnsService))
    private readonly returnsService: ReturnsService,
  ) {}
  private disputes: DisputeRecord[] = [
    {
      id: '1',
      returnId: '2',
      rentalId: '2',
      dressId: '1',
      dressName: 'Angelic Pretty 云境花影 JSK',
      outfitId: '1',
      outfitName: '云端花嫁',
      isOutfitDispute: true,
      userName: '玲玲',
      triggerReasons: [
        { type: 'accessory_missing', description: '套装单品遗失：白色蕾丝高跟鞋', detail: '归还时鞋包单品未归还' },
        { type: 'accessory_missing', description: '蝴蝶结胸针缺失1个', detail: '原配2个，实际归还1个' },
        { type: 'damage_new', description: '裙摆内侧新增小污渍', detail: '严重程度：轻微' },
        { type: 'deduction_excessive', description: '押金扣减超过80元（实际扣减¥310）', detail: '套装单品扣减：¥150，配件扣减：¥50，损坏扣减：¥30，洗护费用：¥80' },
      ],
      deductionDetails: [
        { category: 'outfit_items', itemName: '白色蕾丝高跟鞋', amount: 150, description: '套装单品遗失' },
        { category: 'accessories', itemName: '蝴蝶结胸针', amount: 50, description: '遗失1个蝴蝶结胸针' },
        { category: 'damage', itemName: '裙摆污渍', amount: 30, description: '裙摆内侧新增小污渍' },
        { category: 'cleaning', itemName: '专业洗护', amount: 80, description: '需要专业清洗' },
      ],
      originalDeposit: 1060,
      originalTotalDeduction: 310,
      originalRefundAmount: 750,
      currentRefundAmount: 750,
      customerNote: '高跟鞋可能在路上掉了，胸针可能忘在袋子里了，污渍是穿的时候不小心弄的',
      staffNote: '顾客态度较好，愿意配合扣减',
      reviewStatus: 'approved',
      reviewConclusion: '复核通过，同意扣减金额',
      reviewOperator: '店主张三',
      reviewDate: '2026-07-08',
      createdAt: '2026-07-07',
    },
  ];

  create(createDisputeDto: CreateDisputeDto): DisputeRecord {
    const dispute: DisputeRecord = {
      id: Date.now().toString(),
      returnId: createDisputeDto.returnId,
      rentalId: createDisputeDto.rentalId,
      dressId: createDisputeDto.dressId,
      dressName: createDisputeDto.dressName,
      outfitId: createDisputeDto.outfitId,
      outfitName: createDisputeDto.outfitName,
      isOutfitDispute: createDisputeDto.isOutfitDispute,
      userName: createDisputeDto.userName,
      triggerReasons: createDisputeDto.triggerReasons,
      deductionDetails: createDisputeDto.deductionDetails,
      originalDeposit: createDisputeDto.originalDeposit,
      originalTotalDeduction: createDisputeDto.originalTotalDeduction,
      originalRefundAmount: createDisputeDto.originalRefundAmount,
      currentRefundAmount: createDisputeDto.originalRefundAmount,
      customerNote: createDisputeDto.customerNote || '',
      staffNote: createDisputeDto.staffNote || '',
      reviewStatus: 'pending',
      reviewConclusion: '',
      reviewOperator: '',
      reviewDate: '',
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.disputes.push(dispute);
    return dispute;
  }

  findAll(): DisputeRecord[] {
    return this.disputes;
  }

  findOne(id: string): DisputeRecord {
    const dispute = this.disputes.find((d) => d.id === id);
    if (!dispute) {
      throw new NotFoundException(`Dispute with id ${id} not found`);
    }
    return dispute;
  }

  findByReturnId(returnId: string): DisputeRecord[] {
    return this.disputes.filter((d) => d.returnId === returnId);
  }

  findByReviewStatus(reviewStatus: string): DisputeRecord[] {
    return this.disputes.filter((d) => d.reviewStatus === reviewStatus);
  }

  review(id: string, reviewDisputeDto: ReviewDisputeDto): DisputeRecord {
    const index = this.disputes.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new NotFoundException(`Dispute with id ${id} not found`);
    }

    const dispute = this.disputes[index];
    dispute.reviewStatus = reviewDisputeDto.reviewStatus;
    dispute.reviewConclusion = reviewDisputeDto.reviewConclusion;
    dispute.reviewOperator = reviewDisputeDto.reviewOperator;
    dispute.reviewDate = new Date().toISOString().split('T')[0];

    if (reviewDisputeDto.adjustedRefundAmount !== undefined) {
      dispute.currentRefundAmount = reviewDisputeDto.adjustedRefundAmount;
    } else if (reviewDisputeDto.reviewStatus === 'approved') {
      dispute.currentRefundAmount = dispute.originalRefundAmount;
    } else if (reviewDisputeDto.reviewStatus === 'rejected') {
      dispute.currentRefundAmount = dispute.originalDeposit;
    }

    this.disputes[index] = dispute;

    try {
      this.returnsService.updateRefundFromDispute(
        dispute.returnId,
        dispute.currentRefundAmount,
        dispute.reviewStatus,
      );
    } catch (e) {
      // Ignore if return record not found
    }

    return dispute;
  }

  getDisputeStats() {
    const total = this.disputes.length;
    const approved = this.disputes.filter((d) => d.reviewStatus === 'approved').length;
    const pending = this.disputes.filter((d) => d.reviewStatus === 'pending').length;
    const rejected = this.disputes.filter((d) => d.reviewStatus === 'rejected').length;
    const approvalRate = total > 0 ? parseFloat(((approved / total) * 100).toFixed(1)) : 0;

    const totalDeductionAmount = this.disputes.reduce(
      (sum, d) => sum + d.originalTotalDeduction,
      0,
    );

    const adjustedDeductionAmount = this.disputes.reduce((sum, d) => {
      const diff = d.originalRefundAmount - d.currentRefundAmount;
      return sum + (diff > 0 ? diff : 0);
    }, 0);

    const byTriggerType: Record<string, number> = {};
    this.disputes.forEach((d) => {
      d.triggerReasons.forEach((r) => {
        byTriggerType[r.type] = (byTriggerType[r.type] || 0) + 1;
      });
    });

    return {
      totalDisputes: total,
      pendingDisputes: pending,
      approvedDisputes: approved,
      rejectedDisputes: rejected,
      approvalRate,
      totalDeductionAmount,
      adjustedDeductionAmount,
      byTriggerType,
    };
  }

  checkAndCreateDispute(
    returnRecord: any,
    customerNote?: string,
    staffNote?: string,
  ): DisputeRecord | null {
    const triggerReasons: DisputeTriggerReason[] = [];
    const deductionDetails: DeductionDetail[] = [];
    const isOutfitDispute = returnRecord.isOutfitReturn === true;

    if (isOutfitDispute && returnRecord.outfitItems) {
      const missingItems = returnRecord.outfitItems.filter((i: any) => !i.isReturned);
      if (missingItems.length > 0) {
        triggerReasons.push({
          type: 'accessory_missing',
          description: `套装单品遗失：${missingItems.map((i: any) => i.name).join('、')}`,
          detail: `共${returnRecord.outfitItems.length}件单品，${missingItems.length}件未归还`,
        });
        missingItems.forEach((item: any) => {
          deductionDetails.push({
            category: 'outfit_items',
            itemName: item.name,
            amount: item.deductionAmount || 100,
            description: `套装单品遗失（${item.typeName}）`,
          });
        });
      }
    }

    const hasMissingAccessory = returnRecord.accessories?.some(
      (a: any) => !a.isComplete,
    );
    if (hasMissingAccessory) {
      triggerReasons.push({
        type: 'accessory_missing',
        description: '归还时配件缺失',
        detail: returnRecord.accessories
          .filter((a: any) => !a.isComplete)
          .map((a: any) => a.name)
          .join('、'),
      });
    }

    const hasNewDamage = returnRecord.damages?.some((d: any) => d.isNew);
    if (hasNewDamage) {
      triggerReasons.push({
        type: 'damage_new',
        description: '归还时发现新增瑕疵',
        detail: returnRecord.damages
          .filter((d: any) => d.isNew)
          .map((d: any) => d.description)
          .join('、'),
      });
    }

    if (returnRecord.cleaningCost > 100) {
      triggerReasons.push({
        type: 'cleaning_excessive',
        description: `洗护费用超过100元（实际${returnRecord.cleaningCost}元）`,
        detail: `洗护费用：¥${returnRecord.cleaningCost}`,
      });
    }

    const outfitItemsDeduction = returnRecord.totalOutfitItemsDeduction || 0;
    const accessoriesDeduction = returnRecord.totalAccessoriesDeduction || 0;
    const damageDeduction = returnRecord.totalDamageDeduction || 0;
    const totalDeductionExceptLate = outfitItemsDeduction + accessoriesDeduction + damageDeduction + returnRecord.cleaningCost;
    if (totalDeductionExceptLate > 80) {
      triggerReasons.push({
        type: 'deduction_excessive',
        description: `押金扣减超过80元（实际扣减¥${totalDeductionExceptLate}）`,
        detail: isOutfitDispute
          ? `套装单品扣减：¥${outfitItemsDeduction}，配件扣减：¥${accessoriesDeduction}，损坏扣减：¥${damageDeduction}，洗护费用：¥${returnRecord.cleaningCost}`
          : `配件扣减：¥${accessoriesDeduction}，损坏扣减：¥${damageDeduction}，洗护费用：¥${returnRecord.cleaningCost}`,
      });
    }

    if (triggerReasons.length === 0) {
      return null;
    }

    if (hasMissingAccessory) {
      returnRecord.accessories
        .filter((a: any) => !a.isComplete)
        .forEach((a: any) => {
          deductionDetails.push({
            category: 'accessories',
            itemName: a.name,
            amount: a.deductionAmount || 50,
            description: `缺失${a.name}`,
          });
        });
    }

    if (hasNewDamage) {
      returnRecord.damages
        .filter((d: any) => d.isNew)
        .forEach((d: any) => {
          deductionDetails.push({
            category: 'damage',
            itemName: d.location,
            amount: d.deductionAmount,
            description: d.description,
          });
        });
    }

    if (returnRecord.cleaningCost > 0) {
      deductionDetails.push({
        category: 'cleaning',
        itemName: '洗护费用',
        amount: returnRecord.cleaningCost,
        description: returnRecord.cleaningStatus,
      });
    }

    if (returnRecord.lateFee > 0) {
      deductionDetails.push({
        category: 'late',
        itemName: '逾期费用',
        amount: returnRecord.lateFee,
        description: `逾期${returnRecord.lateDays || 0}天`,
      });
    }

    const existing = this.disputes.find((d) => d.returnId === returnRecord.id);
    if (existing) {
      return existing;
    }

    return this.create({
      returnId: returnRecord.id,
      rentalId: returnRecord.rentalId,
      dressId: returnRecord.dressId,
      dressName: returnRecord.dressName,
      outfitId: returnRecord.outfitId,
      outfitName: returnRecord.outfitName,
      isOutfitDispute,
      userName: returnRecord.userName,
      triggerReasons,
      deductionDetails,
      originalDeposit: returnRecord.depositAmount,
      originalTotalDeduction: returnRecord.totalDeduction,
      originalRefundAmount: returnRecord.refundAmount,
      customerNote,
      staffNote,
    });
  }
}
