import api, { ApiSuccessResponse } from './api';

export type DonationRecord = {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  payment_method: string | null;
  status: string;
  created_at: string | null;
};

export type UserDonationSummary = {
  total_amount: number;
  total_donations_count: number;
};

export type CreateDonationResult = {
  donation: DonationRecord;
  user_summary: UserDonationSummary;
};

type CreateDonationInput = {
  amount: number;
  payment_method_id: string;
};

export async function createDonation(input: CreateDonationInput) {
  const response = (await api.post<ApiSuccessResponse<CreateDonationResult>>(
    '/donations',
    input,
  )) as unknown as ApiSuccessResponse<CreateDonationResult>;

  return response.data;
}
