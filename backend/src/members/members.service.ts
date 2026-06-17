import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { Member, CreditLevel, CreditLogEntry, DepositDeductionRecord, DepositReductionResult } from './entities/member.entity';
import { CalculateDepositReductionDto } from './dto/calculate-reduction.dto';
import { RentalsService } from '../rentals/rentals.service';
import { ReturnsService } from '../returns/returns.service';
import { DisputesService } from '../disputes/disputes.service';

const CREDIT_LEVEL_THRESHOLDS: { level: CreditLevel; min: number; max: number }[] = [
  { level: 'S', min: 90, max: 100 },
  { level: 'A', min: 70, max: 89 },
  { level: 'B', min: 50, max: 69 },
  { level: 'C', min: 30, max: 49 },
  { level: 'D', min: 0, max: 29 },
];

const CREDIT_LEVEL_REDUCTION_RATIOS: Record<CreditLevel, number> = {
  S: 0.5,
  A: 0.3,
  B: 0.15,
  C: 0,
  D: 0,
};

const CREDIT_LEVEL_LABELS: Record<CreditLevel, string> = {
  S: '信用极佳',
  A: '信用良好',
  B: '信用一般',
  C: '信用较低',
  D: '信用极低',
};

@Injectable()
export class MembersService {
  private members: Member[] = [
    {
      id: '1',
      name: '小美',
      phone: '138****0001',
      creditScore: 75,
      creditLevel: 'A',
      totalRentals: 5,
      completedRentals: 4,
      cancelledRentals: 0,
      lateReturns: 1,
      totalDeductions: 170,
      creditLogs: [
        { id: 'cl-1', memberId: '1', change: 2, reason: '创建预约', relatedId: '1', relatedType: 'rental', afterScore: 72, createdAt: '2026-06-10' },
        { id: 'cl-2', memberId: '1', change: -8, reason: '逾期归还', relatedId: '1', relatedType: 'return', afterScore: 64, createdAt: '2026-06-23' },
        { id: 'cl-3', memberId: '1', change: 3, reason: '配件完整归还', relatedId: '1', relatedType: 'return', afterScore: 67, createdAt: '2026-06-23' },
        { id: 'cl-4', memberId: '1', change: 8, reason: '多次准时归还累积奖励', afterScore: 75, createdAt: '2026-06-25' },
      ],
      deductionRecords: [
        { id: 'dd-1', memberId: '1', rentalId: '1', returnId: '1', originalDeposit: 800, deductionAmount: 170, refundAmount: 630, reason: '逾期1天+常规清洗', createdAt: '2026-06-23' },
      ],
      createdAt: '2026-05-01',
    },
    {
      id: '2',
      name: '玲玲',
      phone: '139****0002',
      creditScore: 45,
      creditLevel: 'C',
      totalRentals: 3,
      completedRentals: 2,
      cancelledRentals: 1,
      lateReturns: 0,
      totalDeductions: 310,
      creditLogs: [
        { id: 'cl-5', memberId: '2', change: 2, reason: '创建预约', relatedId: '2', relatedType: 'rental', afterScore: 62, createdAt: '2026-06-15' },
        { id: 'cl-6', memberId: '2', change: -5, reason: '取消预约', afterScore: 57, createdAt: '2026-06-14' },
        { id: 'cl-7', memberId: '2', change: -10, reason: '高额押金扣减(¥310)', relatedId: '2', relatedType: 'return', afterScore: 47, createdAt: '2026-07-07' },
        { id: 'cl-8', memberId: '2', change: -2, reason: '套装配件遗失', relatedId: '2', relatedType: 'return', afterScore: 45, createdAt: '2026-07-07' },
      ],
      deductionRecords: [
        { id: 'dd-2', memberId: '2', rentalId: '2', returnId: '2', originalDeposit: 1060, deductionAmount: 310, refundAmount: 750, reason: '套装单品遗失+配件缺失+新增瑕疵+专业洗护', createdAt: '2026-07-07' },
      ],
      createdAt: '2026-04-15',
    },
    {
      id: '3',
      name: '酷酷',
      phone: '137****0003',
      creditScore: 92,
      creditLevel: 'S',
      totalRentals: 8,
      completedRentals: 8,
      cancelledRentals: 0,
      lateReturns: 0,
      totalDeductions: 0,
      creditLogs: [
        { id: 'cl-9', memberId: '3', change: 2, reason: '创建预约', relatedId: '3', relatedType: 'rental', afterScore: 90, createdAt: '2026-06-16' },
        { id: 'cl-10', memberId: '3', change: 2, reason: '创建预约(新)', afterScore: 92, createdAt: '2026-06-17' },
      ],
      deductionRecords: [],
      createdAt: '2026-02-01',
    },
  ];

  constructor(
    @Inject(forwardRef(() => RentalsService))
    private readonly rentalsService: RentalsService,
    @Inject(forwardRef(() => ReturnsService))
    private readonly returnsService: ReturnsService,
    @Inject(forwardRef(() => DisputesService))
    private readonly disputesService: DisputesService,
  ) {}

  private getCreditLevel(score: number): CreditLevel {
    for (const threshold of CREDIT_LEVEL_THRESHOLDS) {
      if (score >= threshold.min && score <= threshold.max) {
        return threshold.level;
      }
    }
    return 'D';
  }

  private addCreditLog(
    memberId: string,
    change: number,
    reason: string,
    relatedId?: string,
    relatedType?: 'rental' | 'return' | 'dispute',
  ): void {
    const member = this.members.find((m) => m.id === memberId);
    if (!member) return;

    const log: CreditLogEntry = {
      id: `cl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      memberId,
      change,
      reason,
      relatedId,
      relatedType,
      afterScore: member.creditScore,
      createdAt: new Date().toISOString().split('T')[0],
    };
    member.creditLogs.push(log);
  }

  updateCredit(
    memberId: string,
    change: number,
    reason: string,
    relatedId?: string,
    relatedType?: 'rental' | 'return' | 'dispute',
  ): Member {
    const member = this.members.find((m) => m.id === memberId);
    if (!member) {
      throw new NotFoundException(`Member with id ${memberId} not found`);
    }

    member.creditScore = Math.max(0, Math.min(100, member.creditScore + change));
    member.creditLevel = this.getCreditLevel(member.creditScore);
    this.addCreditLog(memberId, change, reason, relatedId, relatedType);

    return member;
  }

  addDeductionRecord(
    memberId: string,
    rentalId: string,
    originalDeposit: number,
    deductionAmount: number,
    refundAmount: number,
    reason: string,
    returnId?: string,
  ): void {
    const member = this.members.find((m) => m.id === memberId);
    if (!member) return;

    const record: DepositDeductionRecord = {
      id: `dd-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      memberId,
      rentalId,
      returnId,
      originalDeposit,
      deductionAmount,
      refundAmount,
      reason,
      createdAt: new Date().toISOString().split('T')[0],
    };
    member.deductionRecords.push(record);
    member.totalDeductions += deductionAmount;
  }

  findOrCreateByUserInfo(name: string, phone: string): Member {
    let member = this.members.find((m) => m.phone === phone);
    if (!member) {
      member = {
        id: Date.now().toString(),
        name,
        phone,
        creditScore: 60,
        creditLevel: 'B',
        totalRentals: 0,
        completedRentals: 0,
        cancelledRentals: 0,
        lateReturns: 0,
        totalDeductions: 0,
        creditLogs: [
          {
            id: `cl-${Date.now()}`,
            memberId: '',
            change: 0,
            reason: '初始信用分60',
            afterScore: 60,
            createdAt: new Date().toISOString().split('T')[0],
          },
        ],
        deductionRecords: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      member.creditLogs[0].memberId = member.id;
      this.members.push(member);
    }
    return member;
  }

  calculateDepositReduction(dto: CalculateDepositReductionDto): DepositReductionResult {
    const member = this.members.find((m) => m.id === dto.memberId);
    if (!member) {
      throw new NotFoundException(`Member with id ${dto.memberId} not found`);
    }

    const result: DepositReductionResult = {
      canReduce: false,
      reductionRatio: 0,
      reductionAmount: 0,
      adjustedDeposit: dto.originalDeposit,
      needManualReview: false,
      riskWarnings: [],
    };

    if (member.creditLevel === 'C' || member.creditLevel === 'D') {
      result.reason = `会员信用等级为${member.creditLevel}级（${CREDIT_LEVEL_LABELS[member.creditLevel]}），不可使用押金减免`;
      result.riskWarnings.push(result.reason);
      return result;
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const recentDeductions = member.deductionRecords.filter(
      (d) => new Date(d.createdAt) >= threeMonthsAgo,
    );
    const recentHighDeduction = recentDeductions.some((d) => d.deductionAmount > 200);
    if (recentHighDeduction) {
      result.reason = '近3个月存在高额扣减记录(>¥200)，禁止使用押金减免';
      result.riskWarnings.push(result.reason);
      return result;
    }

    const reductionRatio = CREDIT_LEVEL_REDUCTION_RATIOS[member.creditLevel];
    const reductionAmount = Math.round(dto.originalDeposit * reductionRatio);
    const adjustedDeposit = dto.originalDeposit - reductionAmount;

    result.canReduce = true;
    result.reductionRatio = reductionRatio;
    result.reductionAmount = reductionAmount;
    result.adjustedDeposit = adjustedDeposit;

    if (member.creditLevel === 'B') {
      result.needManualReview = true;
      result.riskWarnings.push('B级会员减免需人工审核确认');
    }

    if (member.creditScore < 60) {
      result.riskWarnings.push('会员信用分偏低，建议关注');
    }

    if (recentDeductions.length > 0) {
      const totalRecent = recentDeductions.reduce((sum, d) => sum + d.deductionAmount, 0);
      result.riskWarnings.push(`近3个月累计扣减¥${totalRecent}`);
    }

    return result;
  }

  incrementRentalCount(memberId: string): void {
    const member = this.members.find((m) => m.id === memberId);
    if (member) {
      member.totalRentals++;
    }
  }

  incrementCompletedRental(memberId: string): void {
    const member = this.members.find((m) => m.id === memberId);
    if (member) {
      member.completedRentals++;
    }
  }

  incrementCancelledRental(memberId: string): void {
    const member = this.members.find((m) => m.id === memberId);
    if (member) {
      member.cancelledRentals++;
    }
  }

  incrementLateReturn(memberId: string): void {
    const member = this.members.find((m) => m.id === memberId);
    if (member) {
      member.lateReturns++;
    }
  }

  findAll(): Member[] {
    return this.members;
  }

  findOne(id: string): Member {
    const member = this.members.find((m) => m.id === id);
    if (!member) {
      throw new NotFoundException(`Member with id ${id} not found`);
    }
    return member;
  }

  findByPhone(phone: string): Member | undefined {
    return this.members.find((m) => m.phone === phone);
  }

  getMemberStats() {
    const totalMembers = this.members.length;

    const creditLevelDistribution: Record<string, number> = {};
    for (const level of ['S', 'A', 'B', 'C', 'D'] as CreditLevel[]) {
      creditLevelDistribution[level] = this.members.filter((m) => m.creditLevel === level).length;
    }

    const totalDepositReduction = this.members.reduce((sum, m) => {
      const ratio = CREDIT_LEVEL_REDUCTION_RATIOS[m.creditLevel];
      const rentals = this.rentalsService.findAll().filter(
        (r) => r.userInfo.phone === m.phone && r.status !== 'cancelled',
      );
      const reductionForMember = rentals.reduce((s, r) => s + Math.round(r.deposit * ratio), 0);
      return sum + reductionForMember;
    }, 0);

    const membersWithReduction = this.members.filter(
      (m) => m.creditLevel === 'S' || m.creditLevel === 'A' || m.creditLevel === 'B',
    );
    const reducedMemberRentals = this.rentalsService.findAll().filter(
      (r) => membersWithReduction.some((m) => m.phone === r.userInfo.phone) && r.status !== 'cancelled',
    );
    const reducedMemberReturns = this.returnsService.findAll().filter(
      (ret) => membersWithReduction.some((m) => m.phone === ret.userName),
    );
    const overdueAfterReduction = reducedMemberReturns.filter((r) => r.isLate).length;
    const overdueRateAfterReduction = reducedMemberReturns.length > 0
      ? parseFloat(((overdueAfterReduction / reducedMemberReturns.length) * 100).toFixed(1))
      : 0;

    const highRiskMembers = this.members.filter(
      (m) => m.creditLevel === 'C' || m.creditLevel === 'D',
    ).length;

    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const creditScoreTrend = last7Days.map((date) => {
      const logsOnDate = this.members.flatMap((m) =>
        m.creditLogs.filter((l) => l.createdAt === date),
      );
      const totalChange = logsOnDate.reduce((sum, l) => sum + l.change, 0);
      return { date, change: totalChange };
    });

    const avgCreditScore = totalMembers > 0
      ? parseFloat((this.members.reduce((sum, m) => sum + m.creditScore, 0) / totalMembers).toFixed(1))
      : 0;

    return {
      totalMembers,
      creditLevelDistribution,
      totalDepositReduction,
      overdueRateAfterReduction,
      highRiskMembers,
      creditScoreTrend,
      avgCreditScore,
      creditLevelReductionRatios: CREDIT_LEVEL_REDUCTION_RATIOS,
      creditLevelLabels: CREDIT_LEVEL_LABELS,
    };
  }
}
