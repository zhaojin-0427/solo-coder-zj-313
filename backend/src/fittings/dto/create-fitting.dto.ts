import {
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateFittingDto {
  @IsString()
  rentalId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  fitScore: number;

  @IsEnum(['too_small', 'tight', 'perfect', 'loose', 'too_big'])
  bustFit: 'too_small' | 'tight' | 'perfect' | 'loose' | 'too_big';

  @IsEnum(['too_small', 'tight', 'perfect', 'loose', 'too_big'])
  waistFit: 'too_small' | 'tight' | 'perfect' | 'loose' | 'too_big';

  @IsEnum(['too_small', 'tight', 'perfect', 'loose', 'too_big'])
  hipFit: 'too_small' | 'tight' | 'perfect' | 'loose' | 'too_big';

  @IsEnum(['too_short', 'slightly_short', 'perfect', 'slightly_long', 'too_long'])
  lengthFit: 'too_short' | 'slightly_short' | 'perfect' | 'slightly_long' | 'too_long';

  @IsNumber()
  @Min(1)
  @Max(5)
  comfortScore: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  overallSatisfaction: number;

  @IsString()
  feedback: string;

  @IsString()
  suggestions: string;

  @IsBoolean()
  willRentAgain: boolean;
}
