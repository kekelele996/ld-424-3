import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/auditLog.entity';
import { Reagent } from '../models/reagent.entity';
import { ReagentController } from '../controllers/reagent.controller';
import { AuditService } from '../services/audit.service';
import { ReagentService } from '../services/reagent.service';
import { AlertRoutesModule } from './alert.routes';

@Module({
  imports: [TypeOrmModule.forFeature([Reagent, AuditLog]), AlertRoutesModule],
  controllers: [ReagentController],
  providers: [ReagentService, AuditService],
  exports: [ReagentService],
})
export class ReagentRoutesModule {}
