export interface OutfitItemCheck {
  id: string;
  name: string;
  type: string;
  typeName: string;
  isCore: boolean;
  isReturned: boolean;
  condition: string;
  deductionAmount: number;
  notes?: string;
}

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
  outfitId?: string;
  outfitName?: string;
  isOutfitReturn: boolean;
  outfitItems?: OutfitItemCheck[];
  outfitComplete?: boolean;
  totalOutfitItemsDeduction?: number;
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
