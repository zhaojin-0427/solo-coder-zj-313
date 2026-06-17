import {
  IsString,
  IsNumber,
  IsObject,
  IsArray,
  IsOptional,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OutfitItemDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(['dress', 'accessory', 'kc', 'petticoat', 'shoes_bag', 'wig', 'photo_prop'])
  type: 'dress' | 'accessory' | 'kc' | 'petticoat' | 'shoes_bag' | 'wig' | 'photo_prop';

  @IsString()
  typeName: string;

  @IsOptional()
  isCore?: boolean;

  @IsNumber()
  deposit: number;

  @IsNumber()
  dailyPrice: number;

  @IsEnum(['available', 'rented', 'cleaning', 'maintenance'])
  status: 'available' | 'rented' | 'cleaning' | 'maintenance';
}

export class OutfitRentalSlotDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  isAvailable?: boolean;
}

export class HeightRangeDto {
  @IsNumber()
  min: number;

  @IsNumber()
  max: number;
}

export class SizeRangeDto {
  @IsString()
  min: string;

  @IsString()
  max: string;
}

export class CreateOutfitDto {
  @IsString()
  themeName: string;

  @IsString()
  applicableScenario: string;

  @ValidateNested()
  @Type(() => HeightRangeDto)
  recommendedHeightRange: HeightRangeDto;

  @ValidateNested()
  @Type(() => SizeRangeDto)
  recommendedSizeRange: SizeRangeDto;

  @ValidateNested({ each: true })
  @Type(() => OutfitItemDto)
  items: OutfitItemDto[];

  @IsNumber()
  totalDeposit: number;

  @IsNumber()
  totalDailyPrice: number;

  @ValidateNested({ each: true })
  @Type(() => OutfitRentalSlotDto)
  rentalSlots: OutfitRentalSlotDto[];

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
