export interface AccessoryCheck {
  name: string;
  expectedQuantity: number;
  actualQuantity: number;
  condition: string;
  isComplete: boolean;
  deductionAmount: number;
}

export interface Damage {
  location: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  isNew: boolean;
  deductionAmount: number;
}

export class ReturnRecord {
  id: string;
  rentalId: string;
  dressId: string;
  dressName: string;
  userName: string;
  returnDate: string;
  expectedReturnDate: string;
  isLate: boolean;
  lateDays: number;
  lateFee: number;
  accessories: AccessoryCheck[];
  accessoriesComplete: boolean;
  totalAccessoriesDeduction: number;
  damages: Damage[];
  totalDamageDeduction: number;
  cleaningStatus: 'clean' | 'needs_cleaning' | 'needs_professional_cleaning';
  cleaningCost: number;
  depositAmount: number;
  totalDeduction: number;
  refundAmount: number;
  notes: string;
  inspector: string;
  status: 'pending' | 'inspecting' | 'completed' | 'disputed';
  createdAt: string;
}
