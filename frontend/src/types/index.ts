export interface SizeRange {
  bust: { min: number; max: number }
  waist: { min: number; max: number }
  hip: { min: number; max: number }
  length: number
}

export interface Flaw {
  location: string
  description: string
  severity: 'minor' | 'moderate' | 'major'
}

export interface AccessoryItem {
  name: string
  quantity: number
  condition: string
}

export interface RentalSlot {
  startDate: string
  endDate: string
  isAvailable: boolean
}

export interface Consignment {
  ownerName: string
  ownerPhone: string
  consignmentStartDate: string
  consignmentEndDate: string
  commissionRate: number
  basePrice: number
  status: 'active' | 'ended' | 'pending'
}

export interface Dress {
  id: string
  name: string
  brand: string
  series: string
  print: string
  silhouette: string
  color: string
  size: string
  sizeRange: SizeRange
  flaws: Flaw[]
  accessories: AccessoryItem[]
  rentalSlots: RentalSlot[]
  consignment: Consignment
  dailyPrice: number
  deposit: number
  status: 'available' | 'rented' | 'cleaning' | 'maintenance'
  coverImage: string
  description: string
  createdAt: string
}

export interface UserInfo {
  name: string
  phone: string
  height: number
  weight: number
  bust: number
  waist: number
  hip: number
  tryOnPreference: string
  usageScenario: string
  notes?: string
}

export interface FitRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high'
  score: number
  factors: string[]
  suggestions: string[]
}

export interface Rental {
  id: string
  dressId?: string
  dressName?: string
  outfitId?: string
  outfitName?: string
  outfitItems?: OutfitRentalItem[]
  isOutfitRental: boolean
  userInfo: UserInfo
  startDate: string
  endDate: string
  totalDays: number
  totalPrice: number
  deposit: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  fitRiskAssessment: FitRiskAssessment
  createdAt: string
}

export interface CreateRentalRequest {
  dressId?: string
  outfitId?: string
  isOutfitRental: boolean
  userInfo: Omit<UserInfo, 'notes'> & { notes?: string }
  startDate: string
  endDate: string
}

export interface Fitting {
  id: string
  rentalId: string
  dressId: string
  dressName: string
  userName: string
  fitScore: number
  comfortScore: number
  overallSatisfaction: number
  overallScore: number
  qualityScore: number
  bustFit?: string
  waistFit?: string
  hipFit?: string
  lengthFit?: string
  comment: string
  feedback: string
  suggestions: string
  willRentAgain?: boolean
  createdAt: string
}

export interface ReturnAccessory {
  name: string
  isComplete: boolean
  condition: string
  notes?: string
  deductionAmount?: number
  expectedQuantity?: number
  actualQuantity?: number
}

export interface ReturnDamage {
  location: string
  description: string
  severity: 'minor' | 'moderate' | 'major'
  isNew: boolean
  deductionAmount: number
}

export interface ReturnRecord {
  id: string
  rentalId: string
  dressId: string
  dressName: string
  outfitId?: string
  outfitName?: string
  isOutfitReturn: boolean
  outfitItems?: OutfitItemCheck[]
  outfitComplete?: boolean
  totalOutfitItemsDeduction?: number
  userName?: string
  returnDate: string
  expectedReturnDate?: string
  isLate?: boolean
  lateDays?: number
  lateFee?: number
  accessories: ReturnAccessory[]
  accessoriesComplete?: boolean
  damages?: ReturnDamage[]
  cleaningStatus: 'clean' | 'need_wash' | 'needs_cleaning' | 'needs_professional_cleaning' | 'damaged' | 'sent_out'
  cleaningCost: number
  damageDeduction: number
  totalDamageDeduction: number
  totalAccessoriesDeduction: number
  totalDeduction: number
  refundAmount: number
  depositAmount?: number
  notes: string
  customerNote?: string
  staffNote?: string
  inspector?: string
  status?: string
  createdAt: string
}

export interface CreateReturnRequest {
  rentalId: string
  returnDate: string
  isOutfitReturn: boolean
  outfitItems?: OutfitItemCheck[]
  accessories: ReturnAccessory[]
  damages: ReturnDamage[]
  cleaningStatus: string
  cleaningCost: number
  lateFee: number
  damageDeduction: number
  notes: string
  customerNote?: string
  staffNote?: string
  inspector: string
}

export interface OverviewStats {
  totalDresses: number
  totalRentals: number
  totalRevenue: number
  totalCleaningCost: number
  averageFitScore: number
  activeDresses: number
  rentedDresses: number
  cleaningDresses: number
  maintenanceDresses: number
  pendingRentals: number
  confirmedRentals: number
  inProgressRentals: number
  completedRentals: number
  cancelledRentals: number
}

export interface DressStats {
  dressId: string
  dressName: string
  rentalCount: number
  totalRevenue: number
  averageFitScore: number
  averageQualityScore: number
  averageOverallScore: number
  feedbackCount: number
}

export interface ConsignmentStats {
  totalConsignments: number
  activeConsignments: number
  endedConsignments: number
  totalCommission: number
  totalBasePrice: number
  averageCommissionRate: number
  consignmentByBrand: { brand: string; count: number; commission: number }[]
  consignmentByStatus: { status: string; count: number }[]
}

export interface DisputeTriggerReason {
  type: 'accessory_missing' | 'damage_new' | 'cleaning_excessive' | 'deduction_excessive'
  description: string
  detail?: string
}

export interface DeductionDetail {
  category: 'accessories' | 'damage' | 'cleaning' | 'late'
  itemName: string
  amount: number
  description: string
}

export interface DisputeRecord {
  id: string
  returnId: string
  rentalId: string
  dressId: string
  dressName: string
  userName: string
  triggerReasons: DisputeTriggerReason[]
  deductionDetails: DeductionDetail[]
  originalDeposit: number
  originalTotalDeduction: number
  originalRefundAmount: number
  currentRefundAmount: number
  customerNote: string
  staffNote: string
  reviewStatus: 'pending' | 'approved' | 'rejected'
  reviewConclusion: string
  reviewOperator: string
  reviewDate: string
  createdAt: string
}

export interface ReviewDisputeRequest {
  reviewStatus: 'approved' | 'rejected'
  reviewConclusion: string
  reviewOperator: string
  adjustedRefundAmount?: number
}

export interface DisputeStats {
  totalDisputes: number
  pendingDisputes: number
  approvedDisputes: number
  rejectedDisputes: number
  approvalRate: number
  totalDeductionAmount: number
  adjustedDeductionAmount: number
  byTriggerType: Record<string, number>
}

export type OutfitItemType = 'dress' | 'accessory' | 'kc' | 'petticoat' | 'shoes_bag' | 'wig' | 'photo_prop'

export interface HeightRange {
  min: number
  max: number
}

export interface OutfitSizeRange {
  min: string
  max: string
}

export interface OutfitItem {
  id: string
  name: string
  type: OutfitItemType
  typeName: string
  isCore: boolean
  deposit: number
  dailyPrice: number
  status: 'available' | 'rented' | 'cleaning' | 'maintenance'
  isReturned?: boolean
  returnCondition?: string
}

export interface OutfitRentalSlot {
  startDate: string
  endDate: string
  isAvailable: boolean
}

export interface Outfit {
  id: string
  themeName: string
  applicableScenario: string
  recommendedHeightRange: HeightRange
  recommendedSizeRange: OutfitSizeRange
  items: OutfitItem[]
  totalDeposit: number
  totalDailyPrice: number
  rentalSlots: OutfitRentalSlot[]
  description: string
  coverImage: string
  status: 'active' | 'inactive'
  rentalCount: number
  createdAt: string
}

export interface OutfitAvailabilityCheckResult {
  isAvailable: boolean
  unavailableItems: OutfitItem[]
  conflictingSlots: OutfitRentalSlot[]
  messages: string[]
}

export interface CreateOutfitRequest {
  themeName: string
  applicableScenario: string
  recommendedHeightRange: HeightRange
  recommendedSizeRange: OutfitSizeRange
  items: OutfitItem[]
  description: string
  coverImage: string
  status: 'active' | 'inactive'
}

export interface UpdateOutfitRequest {
  themeName?: string
  applicableScenario?: string
  recommendedHeightRange?: HeightRange
  recommendedSizeRange?: OutfitSizeRange
  items?: OutfitItem[]
  description?: string
  coverImage?: string
  status?: 'active' | 'inactive'
}

export interface OutfitRentalItem {
  id: string
  name: string
  type: OutfitItemType
  typeName: string
  isCore: boolean
  deposit: number
  dailyPrice: number
  isReturned?: boolean
  returnCondition?: string
}

export interface OutfitItemCheck {
  id: string
  name: string
  type: OutfitItemType
  typeName: string
  isCore: boolean
  isReturned: boolean
  condition: string
  deductionAmount: number
  notes?: string
}

export interface OutfitStats {
  overview: {
    totalOutfits: number
    activeOutfits: number
    totalOutfitRentals: number
    completedOutfitRentals: number
    totalOutfitRevenue: number
    avgSetOrderPrice: number
  }
  rentalRates: {
    outfitId: string
    themeName: string
    rentalCount: number
    rentalRate: number
  }[]
  priceComparison: {
    avgSetOrderPrice: number
    avgSingleOrderPrice: number
    premiumPercentage: number
  }
  mostPopularScenarios: {
    scenario: string
    count: number
  }[]
  accessoryLossStats: {
    type: string
    typeName: string
    lossCount: number
  }[]
  outfitReturnStats: {
    totalReturns: number
    completeReturns: number
    completeRate: number
  }
}

export interface OutfitFitRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high'
  score: number
  factors: string[]
  suggestions: string[]
}
