export interface ConsignmentAccessory {
  name: string;
  quantity: number;
  condition: string;
}

export interface NegotiationRecord {
  id: string;
  buyerName: string;
  buyerPhone: string;
  offerPrice: number;
  notes: string;
  createdAt: string;
}

export class ConsignmentRecord {
  id: string;
  dressId: string;
  dressName: string;
  brand: string;
  size: string;
  print: string;
  consignorName: string;
  consignorPhone: string;
  consignmentPrice: number;
  minimumPrice: number;
  commissionRate: number;
  startDate: string;
  endDate: string;
  defectDescription: string;
  includedAccessories: ConsignmentAccessory[];
  status: 'active' | 'negotiating' | 'sold' | 'cancelled' | 'expired';
  settlementStatus: 'pending' | 'processing' | 'settled';
  finalPrice: number;
  platformCommission: number;
  consignorAmount: number;
  settlementDeadline: string;
  transactionDate: string;
  currentOffer: number;
  buyerName: string;
  buyerPhone: string;
  negotiations: NegotiationRecord[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
