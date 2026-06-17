export type CreditLevel = 'S' | 'A' | 'B' | 'C' | 'D';

export interface CreditLogEntry {
  id: string;
  memberId: string;
  change: number;
  reason: string;
  relatedId?: string;
  relatedType?: 'rental' | 'return' | 'dispute';
  afterScore: number;
  createdAt: string;
}

export interface DepositDeductionRecord {
  id: string;
  memberId: string;
  rentalId: string;
  returnId?: string;
  originalDeposit: number;
  deductionAmount: number;
  refundAmount: number;
  reason: string;
  createdAt: string;
}

export interface DepositReductionResult {
  canReduce: boolean;
  reductionRatio: number;
  reductionAmount: number;
  adjustedDeposit: number;
  needManualReview: boolean;
  riskWarnings: string[];
  reason?: string;
}

export class Member {
  id: string;
  name: string;
  phone: string;
  creditScore: number;
  creditLevel: CreditLevel;
  totalRentals: number;
  completedRentals: number;
  cancelledRentals: number;
  lateReturns: number;
  totalDeductions: number;
  creditLogs: CreditLogEntry[];
  deductionRecords: DepositDeductionRecord[];
  createdAt: string;
}
