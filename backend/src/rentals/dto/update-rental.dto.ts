import { PartialType } from '@nestjs/mapped-types';
import { CreateRentalDto } from './create-rental.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}
