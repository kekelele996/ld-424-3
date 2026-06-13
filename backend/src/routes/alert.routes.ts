import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumable } from '../models/consumable.entity';
import { Reagent } from '../models/reagent.entity';
import { AlertController } from '../controllers/alert.controller';
import { AlertService } from '../services/alert.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reagent, Consumable])],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertRoutesModule {}
