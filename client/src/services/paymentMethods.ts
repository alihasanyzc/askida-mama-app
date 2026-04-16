import api, { ApiSuccessResponse } from './api';
import type { PaymentMethodRecord } from '../types/domain';

export type CreatePaymentMethodInput = {
  cardholder_name: string;
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  brand: 'visa' | 'mastercard' | 'troy' | 'amex';
  card_type?: string | null;
  is_default?: boolean;
};

export async function listPaymentMethods() {
  const response = (await api.get<ApiSuccessResponse<PaymentMethodRecord[]>>(
    '/payment-methods',
  )) as unknown as ApiSuccessResponse<PaymentMethodRecord[]>;

  return response.data;
}

export async function createPaymentMethod(input: CreatePaymentMethodInput) {
  const response = (await api.post<ApiSuccessResponse<PaymentMethodRecord>>(
    '/payment-methods',
    input,
  )) as unknown as ApiSuccessResponse<PaymentMethodRecord>;

  return response.data;
}
