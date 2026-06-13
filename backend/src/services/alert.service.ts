import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createClient, RedisClientType } from 'redis';
import { Repository } from 'typeorm';
import { Consumable } from '../models/consumable.entity';
import { Reagent } from '../models/reagent.entity';
import { redisConfig } from '../config/redis.config';
import { isLowStock } from '../utils/stockAlert';
import { LowStockDashboard } from '../types/interfaces';

@Injectable()
export class AlertService {
  private client?: RedisClientType;

  constructor(
    @InjectRepository(Reagent) private readonly reagentRepo: Repository<Reagent>,
    @InjectRepository(Consumable) private readonly consumableRepo: Repository<Consumable>,
  ) {}

  private async redis() {
    if (!this.client) {
      this.client = createClient(redisConfig()) as RedisClientType;
      this.client.on('error', () => undefined);
      await this.client.connect();
    }
    return this.client;
  }

  async cacheLowStockAlert(item: Reagent | Consumable, type: string) {
    if (!isLowStock(Number(item.currentStock), Number(item.minStockThreshold))) return;
    try {
      const client = await this.redis();
      await client.setEx(`low-stock:${type}:${item.id}`, 3600, JSON.stringify({ name: item.name, currentStock: item.currentStock, minStockThreshold: item.minStockThreshold }));
    } catch {
      return;
    }
  }

  async getLowStockDashboard(): Promise<LowStockDashboard> {
    const [reagents, consumables] = await Promise.all([
      this.reagentRepo
        .createQueryBuilder('reagent')
        .where('reagent.currentStock <= reagent.minStockThreshold')
        .orderBy('reagent.name', 'ASC')
        .getMany(),
      this.consumableRepo
        .createQueryBuilder('consumable')
        .where('consumable.currentStock <= consumable.minStockThreshold')
        .orderBy('consumable.name', 'ASC')
        .getMany(),
    ]);

    const lowStockReagents = reagents.map((r) => ({
      id: r.id,
      name: r.name,
      currentStock: Number(r.currentStock),
      minStockThreshold: Number(r.minStockThreshold),
      location: r.location,
      unit: r.unit,
    }));

    const lowStockConsumables = consumables.map((c) => ({
      id: c.id,
      name: c.name,
      currentStock: Number(c.currentStock),
      minStockThreshold: Number(c.minStockThreshold),
      location: c.location,
      unit: c.unit,
    }));

    return {
      reagents: lowStockReagents,
      consumables: lowStockConsumables,
      summary: {
        total: lowStockReagents.length + lowStockConsumables.length,
        reagentCount: lowStockReagents.length,
        consumableCount: lowStockConsumables.length,
      },
    };
  }
}
