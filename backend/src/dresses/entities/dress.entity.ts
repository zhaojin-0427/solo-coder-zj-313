export interface Accessory {
  name: string;
  quantity: number;
  condition: string;
}

export interface Flaw {
  location: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major';
}

export interface SizeRange {
  bust: { min: number; max: number };
  waist: { min: number; max: number };
  hip: { min: number; max: number };
  length: number;
}

export interface RentalSlot {
  startDate: string;
  endDate: string;
  isAvailable: boolean;
}

export interface ConsignmentInfo {
  ownerName: string;
  ownerPhone: string;
  consignmentStartDate: string;
  consignmentEndDate: string;
  commissionRate: number;
  basePrice: number;
  status: 'active' | 'ended' | 'pending';
}

export class Dress {
  id: string;
  name: string;
  brand: string;
  series: string;
  print: string;
  silhouette: string;
  color: string;
  size: string;
  sizeRange: SizeRange;
  flaws: Flaw[];
  accessories: Accessory[];
  rentalSlots: RentalSlot[];
  consignment: ConsignmentInfo;
  dailyPrice: number;
  deposit: number;
  status: 'available' | 'rented' | 'cleaning' | 'maintenance';
  coverImage: string;
  description: string;
  createdAt: string;
}
