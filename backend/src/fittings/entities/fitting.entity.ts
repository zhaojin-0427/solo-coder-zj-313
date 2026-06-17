export class Fitting {
  id: string;
  rentalId: string;
  dressId: string;
  dressName: string;
  userName: string;
  fitScore: number;
  bustFit: 'too_small' | 'tight' | 'perfect' | 'loose' | 'too_big';
  waistFit: 'too_small' | 'tight' | 'perfect' | 'loose' | 'too_big';
  hipFit: 'too_small' | 'tight' | 'perfect' | 'loose' | 'too_big';
  lengthFit: 'too_short' | 'slightly_short' | 'perfect' | 'slightly_long' | 'too_long';
  comfortScore: number;
  overallSatisfaction: number;
  feedback: string;
  suggestions: string;
  willRentAgain: boolean;
  createdAt: string;
}
