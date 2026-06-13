import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Consumable } from '../models/consumable.entity';
import { Reagent } from '../models/reagent.entity';
import { UsageRecord } from '../models/usageRecord.entity';
import { UsageController } from '../controllers/usage.controller';
import { AuditService } from '../services/audit.service';
import { ConsumableService } from '../services/consumable.service';
import { ReagentService } from '../services/reagent.service';
import { UsageService } from '../services/usage.service';
import { AlertRoutesModule } from './alert.routes';

@Module({
  imports: [TypeOrmModule.forFeature([UsageRecord, Reagent, Consumable, AuditLog]), AlertRoutesModule],
  controllers: [UsageController],
  providers: [UsageService, ReagentService, ConsumableService, AuditService],
})
export class UsageRoutesModule {}
