export interface DisputeTriggerReason {
  type: 'accessory_missing' | 'damage_new' | 'cleaning_excessive' | 'deduction_excessive';
  description: string;
  detail?: string;
}

export interface DeductionDetail {
  category: 'accessories' | 'damage' | 'cleaning' | 'late' | 'outfit_items';
  itemName: string;
  amount: number;
  description: string;
}

export class DisputeRecord {
  id: string;
  returnId: string;
  rentalId: string;
  dressId: string;
  dressName: string;
  outfitId?: string;
  outfitName?: string;
  isOutfitDispute: boolean;
  userName: string;
  triggerReasons: DisputeTriggerReason[];
  deductionDetails: DeductionDetail[];
  originalDeposit: number;
  originalTotalDeduction: number;
  originalRefundAmount: number;
  currentRefundAmount: number;
  customerNote: string;
  staffNote: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewConclusion: string;
  reviewOperator: string;
  reviewDate: string;
  createdAt: string;
}
