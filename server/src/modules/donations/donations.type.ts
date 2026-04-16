export type CreateGeneralDonationInput = {
  amount: number;
  payment_method_id: string;
};

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

export type CreateGeneralDonationResult = {
  donation: DonationRecord;
  user_summary: UserDonationSummary;
};
