import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FuelingFiltersDto {
  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsString()
  driver?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
