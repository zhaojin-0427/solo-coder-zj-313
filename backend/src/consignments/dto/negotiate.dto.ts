import { IsString, IsNumber, IsOptional } from 'class-validator';

export class NegotiateDto {
  @IsString()
  buyerName: string;

  @IsString()
  buyerPhone: string;

  @IsNumber()
  offerPrice: number;

  @IsString()
  @IsOptional()
  notes: string;
}
