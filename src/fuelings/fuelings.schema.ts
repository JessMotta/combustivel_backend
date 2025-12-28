import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FuelingDocument = Fueling & Document;

@Schema({
  timestamps: true,
  collection: 'combustiveis',
})
export class Fueling {
  @Prop({ required: true, index: true })
  driver: string;

  @Prop({ required: true, index: true })
  plate: string;

  @Prop({ required: true })
  odometer: number;

  @Prop({ required: true, index: true })
  fuelType: string;

  @Prop({ required: true })
  pricePerLiter: number;

  @Prop({ required: true })
  volume: number;

  @Prop({ required: true })
  totalValue: number;
}

export const FuelingSchema = SchemaFactory.createForClass(Fueling);

/**
 * INDEXES PARA PERFORMANCE DE GRÁFICOS
 */

// Filtro por combustível + período
FuelingSchema.index({ fuelType: 1, createdAt: -1 });

// Filtro por condutor + período
FuelingSchema.index({ driver: 1, createdAt: -1 });

// Filtro por veículo + período
FuelingSchema.index({ plate: 1, createdAt: -1 });

// Resumos gerais por período
FuelingSchema.index({ createdAt: -1 });
