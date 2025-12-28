import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FuelingsController } from './fuelings.controller';
import { FuelingsService } from './fuelings.service';
import { Fueling, FuelingSchema } from './fuelings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fueling.name, schema: FuelingSchema }]),
  ],
  controllers: [FuelingsController],
  providers: [FuelingsService],
})
export class FuelingsModule {}
