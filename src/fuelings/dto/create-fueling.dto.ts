import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateFuelingDto {
  @IsString()
  @IsNotEmpty()
  driver: string;

  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsNumber()
  odometer: number;

  @IsString()
  fuelType: string;

  @IsNumber()
  pricePerLiter: number;

  @IsNumber()
  volume: number;
}
