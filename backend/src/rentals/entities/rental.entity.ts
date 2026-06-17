export interface UserInfo {
  name: string;
  phone: string;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hip: number;
  tryOnPreference: string;
  usageScenario: string;
  notes?: string;
}

export interface FitRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
  factors: string[];
  suggestions: string[];
}

export class Rental {
  id: string;
  dressId: string;
  dressName: string;
  userInfo: UserInfo;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  deposit: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  fitRiskAssessment: FitRiskAssessment;
  createdAt: string;
}
