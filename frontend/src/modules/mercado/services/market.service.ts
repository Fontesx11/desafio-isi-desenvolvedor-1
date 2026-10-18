import { api } from '@/shared/api/api';
import type {
  BuyPlayer,
  PurchaseResult,
  SaleResult,
} from '../types/market.types';

export const buyPlayer = async (id: number, purchase: BuyPlayer) => {
  const { data } = await api.post<PurchaseResult>(
    `/players/${id}/buy`,
    purchase,
  );
  return data;
};

export const sellPlayer = async (id: number) => {
  const { data } = await api.post<SaleResult>(`/players/${id}/sell`);
  return data;
};
