import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AccessoryCheckDto {
  @IsString()
  name: string;

  @IsNumber()
  expectedQuantity: number;

  @IsNumber()
  actualQuantity: number;

  @IsString()
  condition: string;

  @IsBoolean()
  isComplete: boolean;

  @IsNumber()
  deductionAmount: number;
}

class DamageDto {
  @IsString()
  location: string;

  @IsString()
  description: string;

  @IsEnum(['minor', 'moderate', 'major'])
  severity: 'minor' | 'moderate' | 'major';

  @IsBoolean()
  isNew: boolean;

  @IsNumber()
  deductionAmount: number;
}

export class CreateReturnDto {
  @IsString()
  rentalId: string;

  @IsString()
  returnDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccessoryCheckDto)
  accessories: AccessoryCheckDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DamageDto)
  damages: DamageDto[];

  @IsEnum(['clean', 'needs_cleaning', 'needs_professional_cleaning'])
  cleaningStatus: 'clean' | 'needs_cleaning' | 'needs_professional_cleaning';

  @IsNumber()
  cleaningCost: number;

  @IsNumber()
  lateFee: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  staffNote?: string;

  @IsString()
  inspector: string;
}
