import {
  IsString,
  IsNumber,
  IsObject,
  IsEnum,
  IsOptional,
  ValidateNested,
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
  @IsString()
  dressId: string;

  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
