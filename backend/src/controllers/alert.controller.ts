import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AlertService } from '../services/alert.service';
import { ok } from '../utils/response';

@ApiTags('alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get('low-stock-dashboard')
  async getLowStockDashboard() {
    return ok(await this.alertService.getLowStockDashboard());
  }
}
