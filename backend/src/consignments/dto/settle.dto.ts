import { IsEnum } from 'class-validator';

export class SettleDto {
  @IsEnum(['pending', 'processing', 'settled'])
  settlementStatus: 'pending' | 'processing' | 'settled';
}
