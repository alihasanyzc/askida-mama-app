export type AnimalType = 'cat' | 'dog';

export type ProductRecord = {
  id: string;
  animal_type: AnimalType;
  image_url: string;
  name: string;
  price: number;
  description: string;
  nutrition_info: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CreateProductInput = {
  animal_type: AnimalType;
  image_url: string;
  name: string;
  price: number;
  description: string;
  nutrition_info?: string | null;
};

export type CreateProductDonationInput = {
  quantity: number;
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

export type ProductDonationRecord = {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string | null;
  quantity: number;
  unit_price: number;
  total_amount: number;
  payment_method: string | null;
  status: string;
  created_at: string | null;
};
