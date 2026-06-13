import { Request } from 'express';
import { Role } from './enums';

export interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minStockThreshold: number;
  location: string;
  unit: string;
}

export interface LowStockDashboard {
  reagents: LowStockItem[];
  consumables: LowStockItem[];
  summary: {
    total: number;
    reagentCount: number;
    consumableCount: number;
  };
}

export interface AuthUser {
  id: string;
  role: Role;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
