import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DisputeTriggerReason, DeductionDetail } from '../entities/dispute.entity';

export class CreateDisputeDto {
  @IsString()
  returnId: string;

  @IsString()
  rentalId: string;

  @IsString()
  dressId: string;

  @IsString()
  dressName: string;

  @IsString()
  userName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  triggerReasons: DisputeTriggerReason[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  deductionDetails: DeductionDetail[];

  @IsNumber()
  originalDeposit: number;

  @IsNumber()
  originalTotalDeduction: number;

  @IsNumber()
  originalRefundAmount: number;

  @IsOptional()
  @IsString()
  customerNote?: string;

  @IsOptional()
  @IsString()
  staffNote?: string;
}

export class ReviewDisputeDto {
  @IsEnum(['approved', 'rejected'])
  reviewStatus: 'approved' | 'rejected';

  @IsString()
  reviewConclusion: string;

  @IsString()
  reviewOperator: string;

  @IsOptional()
  @IsNumber()
  adjustedRefundAmount?: number;
}
