export type ClinicRecord = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  city: string | null;
  district: string | null;
  location_description: string | null;
  maps_url: string;
  created_at: string | null;
  updated_at: string | null;
  donation_summary?: {
    total_amount: number;
    total_donations_count: number;
    user_total_amount: number;
    user_donations_count: number;
  };
};

export type CreateClinicInput = {
  name: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  location_description?: string | null;
  locationDescription?: string | null;
};

export type CreateClinicDonationInput = {
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

export type ClinicDonationRecord = {
  id: string;
  user_id: string;
  clinic_id: string;
  clinic_name: string | null;
  total_amount: number;
  payment_method: string | null;
  status: string;
  created_at: string | null;
};
