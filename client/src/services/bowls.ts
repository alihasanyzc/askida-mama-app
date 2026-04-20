import api, { type ApiSuccessResponse } from './api';

import type { BowlRecord } from '../types/domain';

export type UpdateBowlAddressPayload = {
  latitude: number;
  longitude: number;
  address_line?: string | null;
  locationDescription?: string | null;
};

export type UpdateBowlStatusPayload = {
  status: 'full' | 'empty' | 'dolu' | 'boş';
};

export type CreateBowlDonationResult = {
  donation: {
    id: string;
    user_id: string;
    bowl_id: string;
    type: string;
    amount: number;
    payment_method: string | null;
    status: string;
    created_at: string | null;
  };
  donation_summary: {
    total_amount: number;
    total_donations_count: number;
    user_total_amount: number;
    user_donations_count: number;
  };
};

export function normalizeQrCode(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  const bowlCodeMatch = trimmedValue.match(/BOWL-[A-Z0-9-]+/i);

  if (bowlCodeMatch) {
    return bowlCodeMatch[0].toUpperCase();
  }

  return trimmedValue.toUpperCase();
}

export async function listBowls(): Promise<BowlRecord[]> {
  const response = (await api.get<ApiSuccessResponse<BowlRecord[]>>(
    '/bowls',
  )) as unknown as ApiSuccessResponse<BowlRecord[]>;

  return response.data;
}

export async function getBowlDetail(bowlId: string): Promise<BowlRecord> {
  const response = (await api.get<ApiSuccessResponse<BowlRecord>>(
    `/bowls/${bowlId}`,
  )) as unknown as ApiSuccessResponse<BowlRecord>;

  return response.data;
}

export async function getBowlDetailByQrCode(qrCode: string): Promise<BowlRecord> {
  const normalizedQrCode = normalizeQrCode(qrCode);
  const response = (await api.get<ApiSuccessResponse<BowlRecord>>(
    `/bowls/qr/${encodeURIComponent(normalizedQrCode)}`,
  )) as unknown as ApiSuccessResponse<BowlRecord>;

  return response.data;
}

export async function createBowlDonation(
  bowlId: string,
  payload: { amount: number; payment_method_id: string },
): Promise<CreateBowlDonationResult> {
  const response = (await api.post<ApiSuccessResponse<CreateBowlDonationResult>>(
    `/bowls/${bowlId}/donations`,
    payload,
  )) as unknown as ApiSuccessResponse<CreateBowlDonationResult>;

  return response.data;
}

export async function updateBowlAddress(
  bowlId: string,
  payload: UpdateBowlAddressPayload,
): Promise<BowlRecord> {
  const response = (await api.patch<ApiSuccessResponse<BowlRecord>>(
    `/bowls/${bowlId}/address`,
    payload,
  )) as unknown as ApiSuccessResponse<BowlRecord>;

  return response.data;
}

export async function updateBowlStatus(
  bowlId: string,
  payload: UpdateBowlStatusPayload,
): Promise<BowlRecord> {
  const response = (await api.patch<ApiSuccessResponse<BowlRecord>>(
    `/bowls/${bowlId}/status`,
    payload,
  )) as unknown as ApiSuccessResponse<BowlRecord>;

  return response.data;
}
