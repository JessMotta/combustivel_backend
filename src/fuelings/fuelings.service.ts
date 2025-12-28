import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fueling } from './fuelings.schema';
import { CreateFuelingDto } from './dto/create-fueling.dto';

interface MetricsFilters {
  fuelType?: string;
  driver?: string;
  plate?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable()
export class FuelingsService {
  constructor(
    @InjectModel(Fueling.name)
    private readonly fuelingModel: Model<Fueling>,
  ) {}

  // =====================================================
  // CRUD
  // =====================================================

  async create(dto: CreateFuelingDto) {
    const totalValue = dto.volume * dto.pricePerLiter;
    const fueling = new this.fuelingModel({
      ...dto,
      totalValue,
    });
    return fueling.save();
  }

  async findAll(filters: {
    driver?: string;
    plate?: string;
    fuelType?: string;
  }) {
    const query: any = {};

    if (filters.driver) {
      query.driver = { $regex: filters.driver, $options: 'i' };
    }

    if (filters.plate) {
      query.plate = { $regex: filters.plate, $options: 'i' };
    }

    if (filters.fuelType) {
      query.fuelType = filters.fuelType;
    }

    return this.fuelingModel.find(query).sort({ createdAt: -1 }).lean();
  }

  // =====================================================
  // FUNÇÃO BASE DE FILTROS
  // =====================================================

  private buildMatch(filters: MetricsFilters) {
    const match: any = {};

    if (filters.fuelType) {
      match.fuelType = filters.fuelType;
    }

    if (filters.driver) {
      match.driver = { $regex: filters.driver, $options: 'i' };
    }

    if (filters.plate) {
      match.plate = { $regex: filters.plate, $options: 'i' };
    }

    if (filters.startDate || filters.endDate) {
      match.createdAt = {};
      if (filters.startDate) {
        match.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        match.createdAt.$lte = new Date(filters.endDate);
      }
    }

    return match;
  }

  // =====================================================
  // MÉTRICAS / GRÁFICOS
  // =====================================================

  async metricsByFuel(filters: MetricsFilters) {
    return this.fuelingModel.aggregate([
      { $match: this.buildMatch(filters) },
      {
        $group: {
          _id: '$fuelType',
          totalValue: { $sum: '$totalValue' },
          totalVolume: { $sum: '$volume' },
        },
      },
      {
        $project: {
          fuelType: '$_id',
          totalValue: 1,
          totalVolume: 1,
          _id: 0,
        },
      },
      { $sort: { totalValue: -1 } },
    ]);
  }

  async metricsByDriver(filters: MetricsFilters) {
    return this.fuelingModel.aggregate([
      { $match: this.buildMatch(filters) },
      {
        $group: {
          _id: '$driver',
          totalValue: { $sum: '$totalValue' },
          totalVolume: { $sum: '$volume' },
        },
      },
      {
        $project: {
          driver: '$_id',
          totalValue: 1,
          totalVolume: 1,
          _id: 0,
        },
      },
      { $sort: { totalValue: -1 } },
    ]);
  }

  async metricsByVehicle(filters: MetricsFilters) {
    return this.fuelingModel.aggregate([
      { $match: this.buildMatch(filters) },
      {
        $group: {
          _id: '$plate',
          totalValue: { $sum: '$totalValue' },
          totalVolume: { $sum: '$volume' },
        },
      },
      {
        $project: {
          plate: '$_id',
          totalValue: 1,
          totalVolume: 1,
          _id: 0,
        },
      },
      { $sort: { totalValue: -1 } },
    ]);
  }

  async metricsSummary(filters: MetricsFilters) {
    const result = await this.fuelingModel.aggregate([
      { $match: this.buildMatch(filters) },
      {
        $group: {
          _id: null,
          totalFuelings: { $sum: 1 },
          totalValue: { $sum: '$totalValue' },
          totalVolume: { $sum: '$volume' },
        },
      },
      {
        $project: {
          _id: 0,
          totalFuelings: 1,
          totalValue: 1,
          totalVolume: 1,
          averagePerFueling: {
            $cond: [
              { $eq: ['$totalFuelings', 0] },
              0,
              { $divide: ['$totalValue', '$totalFuelings'] },
            ],
          },
        },
      },
    ]);

    return (
      result[0] || {
        totalFuelings: 0,
        totalValue: 0,
        totalVolume: 0,
        averagePerFueling: 0,
      }
    );
  }
}
