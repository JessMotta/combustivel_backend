import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FuelingsService } from './fuelings.service';
import { CreateFuelingDto } from './dto/create-fueling.dto';

@Controller('fuelings')
export class FuelingsController {
  constructor(private readonly service: FuelingsService) {}

  // =====================================================
  // CRUD
  // =====================================================

  /**
   * Criar novo abastecimento
   */
  @Post()
  create(@Body() dto: CreateFuelingDto) {
    return this.service.create(dto);
  }

  /**
   * Listar abastecimentos (com filtros básicos)
   * Ex:
   * /fuelings?driver=joao&plate=ABC&fuelType=Gasolina
   */
  @Get()
  findAll(
    @Query('driver') driver?: string,
    @Query('plate') plate?: string,
    @Query('fuelType') fuelType?: string,
  ) {
    return this.service.findAll({ driver, plate, fuelType });
  }

  // =====================================================
  // MÉTRICAS / GRÁFICOS
  // =====================================================

  /**
   * 📊 Gastos e volume por combustível
   * Dropdown: combustível
   */
  @Get('metrics/by-fuel')
  metricsByFuel(
    @Query()
    query: {
      fuelType?: string;
      driver?: string;
      plate?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.service.metricsByFuel(query);
  }

  /**
   * 👤 Gastos por condutor
   * Dropdown: condutor
   */
  @Get('metrics/by-driver')
  metricsByDriver(
    @Query()
    query: {
      fuelType?: string;
      driver?: string;
      plate?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.service.metricsByDriver(query);
  }

  /**
   * 🚗 Gastos por veículo (placa)
   * Dropdown: veículo
   */
  @Get('metrics/by-vehicle')
  metricsByVehicle(
    @Query()
    query: {
      fuelType?: string;
      driver?: string;
      plate?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.service.metricsByVehicle(query);
  }

  /**
   * 📌 Resumo geral (cards no bottom do dashboard)
   * - total de abastecimentos
   * - gasto total
   * - volume total
   * - média por abastecimento
   */
  @Get('metrics/summary')
  metricsSummary(
    @Query()
    query: {
      fuelType?: string;
      driver?: string;
      plate?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    return this.service.metricsSummary(query);
  }
}
