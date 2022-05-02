import { Booking } from '@prisma/client';

export interface BookingsResponse {
  data: Partial<Booking>[];
  page: number;
  pageSize: number;
  total: number;
}
