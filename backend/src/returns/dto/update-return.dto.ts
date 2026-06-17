import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnDto } from './create-return.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateReturnDto extends PartialType(CreateReturnDto) {
  @IsOptional()
  @IsEnum(['pending', 'inspecting', 'completed', 'disputed'])
  status?: 'pending' | 'inspecting' | 'completed' | 'disputed';
}
