import {
  IsString,
  IsNumber,
  IsObject,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class UserInfoDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsNumber()
  height: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  bust: number;

  @IsNumber()
  waist: number;

  @IsNumber()
  hip: number;

  @IsString()
  tryOnPreference: string;

  @IsString()
  usageScenario: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateRentalDto {
  @IsOptional()
  @IsString()
  dressId?: string;

  @IsOptional()
  @IsString()
  outfitId?: string;

  @IsBoolean()
  isOutfitRental: boolean;

  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
