export type PaymentMethodRecord = {
  id: string;
  brand: string;
  last4: string;
  masked_number: string;
  cardholder_name: string;
  expiry_month: number;
  expiry_year: number;
  expiry_date: string;
  card_type: string | null;
  is_default: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type CreatePaymentMethodInput = {
  cardholder_name: string;
  card_number: string;
  expiry_month: number;
  expiry_year: number;
  brand: string;
  card_type?: string | null;
  is_default?: boolean;
};
