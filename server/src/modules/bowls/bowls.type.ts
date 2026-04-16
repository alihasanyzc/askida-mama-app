export type BowlStatusColor = 'red' | 'green' | 'gray';

export type BowlStatusLabel = 'dolu' | 'boş' | 'bilinmiyor';

export type BowlMarkerRecord = {
  id: string;
  qr_code: string;
  status: string;
  status_color: BowlStatusColor;
  status_label: BowlStatusLabel;
  latitude: number;
  longitude: number;
  address_line: string | null;
  location_note: string | null;
  location_description: string | null;
  maps_url: string;
  updated_at: string | null;
};

export type BowlDetailRecord = BowlMarkerRecord & {
  created_at: string | null;
  donation_summary: {
    total_amount: number;
    total_donations_count: number;
    user_total_amount: number;
    user_donations_count: number;
  };
};

export type BowlDetailBaseRecord = Omit<BowlDetailRecord, 'donation_summary'>;

export type UpdateBowlStatusInput = {
  status: string;
};

export type UpdateBowlAddressInput = {
  latitude: number;
  longitude: number;
  address_line?: string | null;
  location_note?: string | null;
  locationDescription?: string | null;
};

export type CreateBowlDonationInput = {
  amount: number;
  payment_method?: string | null;
  payment_method_id?: string;
  save_card?: boolean;
  new_card?: {
    cardholder_name: string;
    card_number: string;
    expiry_month: number;
    expiry_year: number;
    brand: string;
    card_type?: string | null;
  };
};

export type BowlDonationRecord = {
  id: string;
  user_id: string;
  bowl_id: string;
  type: string;
  amount: number;
  payment_method: string | null;
  status: string;
  created_at: string | null;
};
