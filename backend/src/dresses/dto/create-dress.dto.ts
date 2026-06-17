import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SizeRangeDto {
  @IsObject()
  bust: { min: number; max: number };

  @IsObject()
  waist: { min: number; max: number };

  @IsObject()
  hip: { min: number; max: number };

  @IsNumber()
  length: number;
}

class FlawDto {
  @IsString()
  location: string;

  @IsString()
  description: string;

  @IsEnum(['minor', 'moderate', 'major'])
  severity: 'minor' | 'moderate' | 'major';
}

class AccessoryDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsString()
  condition: string;
}

class RentalSlotDto {
  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  isAvailable?: boolean;
}

class ConsignmentInfoDto {
  @IsString()
  ownerName: string;

  @IsString()
  ownerPhone: string;

  @IsString()
  consignmentStartDate: string;

  @IsString()
  consignmentEndDate: string;

  @IsNumber()
  commissionRate: number;

  @IsNumber()
  basePrice: number;

  @IsEnum(['active', 'ended', 'pending'])
  status: 'active' | 'ended' | 'pending';
}

export class CreateDressDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsString()
  series: string;

  @IsString()
  print: string;

  @IsString()
  silhouette: string;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @ValidateNested()
  @Type(() => SizeRangeDto)
  sizeRange: SizeRangeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlawDto)
  flaws: FlawDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccessoryDto)
  accessories: AccessoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RentalSlotDto)
  rentalSlots: RentalSlotDto[];

  @ValidateNested()
  @Type(() => ConsignmentInfoDto)
  consignment: ConsignmentInfoDto;

  @IsNumber()
  dailyPrice: number;

  @IsNumber()
  deposit: number;

  @IsEnum(['available', 'rented', 'cleaning', 'maintenance'])
  status: 'available' | 'rented' | 'cleaning' | 'maintenance';

  @IsString()
  coverImage: string;

  @IsString()
  description: string;
}
