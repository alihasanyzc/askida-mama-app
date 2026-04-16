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
  const response = (await api.get<ApiSuccessResponse<BowlRecord>>(
    `/bowls/qr/${encodeURIComponent(qrCode)}`,
  )) as unknown as ApiSuccessResponse<BowlRecord>;

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
