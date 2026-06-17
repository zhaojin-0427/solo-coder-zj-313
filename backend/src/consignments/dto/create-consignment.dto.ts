import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ConsignmentAccessoryDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsString()
  condition: string;
}

export class CreateConsignmentDto {
  @IsString()
  dressId: string;

  @IsString()
  consignorName: string;

  @IsString()
  consignorPhone: string;

  @IsNumber()
  consignmentPrice: number;

  @IsNumber()
  minimumPrice: number;

  @IsNumber()
  commissionRate: number;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  @IsOptional()
  defectDescription: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsignmentAccessoryDto)
  includedAccessories: ConsignmentAccessoryDto[];

  @IsString()
  @IsOptional()
  notes: string;
}
