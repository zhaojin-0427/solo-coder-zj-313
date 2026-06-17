export interface OutfitItem {
  id: string;
  name: string;
  type: 'dress' | 'accessory' | 'kc' | 'petticoat' | 'shoes_bag' | 'wig' | 'photo_prop';
  typeName: string;
  isCore: boolean;
  deposit: number;
  dailyPrice: number;
  status: 'available' | 'rented' | 'cleaning' | 'maintenance';
}

export interface OutfitRentalSlot {
  startDate: string;
  endDate: string;
  isAvailable: boolean;
}

export interface HeightRange {
  min: number;
  max: number;
}

export interface SizeRange {
  min: string;
  max: string;
}

export class Outfit {
  id: string;
  themeName: string;
  applicableScenario: string;
  recommendedHeightRange: HeightRange;
  recommendedSizeRange: SizeRange;
  items: OutfitItem[];
  totalDeposit: number;
  totalDailyPrice: number;
  rentalSlots: OutfitRentalSlot[];
  description: string;
  coverImage: string;
  status: 'active' | 'inactive';
  rentalCount: number;
  createdAt: string;
}

export interface OutfitAvailabilityCheckResult {
  isAvailable: boolean;
  unavailableItems: {
    name: string;
    typeName: string;
    reason: string;
    isCore: boolean;
  }[];
  conflictingRentals: {
    itemName: string;
    startDate: string;
    endDate: string;
  }[];
}
