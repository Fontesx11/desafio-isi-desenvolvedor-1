import { api } from '@/shared/api/api';
import type {
  BuyPlayer,
  PurchaseResult,
  SaleResult,
  TransactionHistory,
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

export const getTransactions = async (clubId: number, queryParams = '') => {
  const { data } = await api.get<TransactionHistory>(
    `/clubs/${clubId}/transactions?${queryParams}`,
  );
  return data;
};

export const exportTransactions = async (clubId: number, queryParams = '') => {
  const { data } = await api.get<string>(
    `/clubs/${clubId}/transactions/export?${queryParams}`,
  );
  return data;
};
