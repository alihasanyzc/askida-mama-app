export type AnnouncementCategory = 'injured' | 'report' | 'adoption' | 'lost';

export type AnnouncementReportType =
  | 'dead'
  | 'unchipped'
  | 'aggressive'
  | 'abuse'
  | 'stray'
  | 'other';

export type AnnouncementAnimalType = 'cat' | 'dog';

export type AnnouncementAge =
  | '0-6months'
  | '6-12months'
  | '1-3years'
  | '3-7years'
  | '7+years';

export type AnnouncementGender = 'female' | 'male';

export type AnnouncementBinaryChoice = 'yes' | 'no';

export type AnnouncementVaccinationStatus = 'vaccinated' | 'not_vaccinated';

export type AnnouncementHealthStatus = 'healthy' | 'injured';

export type AnnouncementEnvironment = 'home' | 'street' | 'shelter';

export type AnnouncementAuthorRecord = {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
};

export type AnnouncementImageRecord = {
  id: string;
  image_url: string;
  display_order: number;
};

export type AnnouncementRecord = {
  id: string;
  user_id: string;
  category: AnnouncementCategory;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  district: string | null;
  location_note: string | null;
  maps_url: string;
  phone: string | null;
  email: string | null;
  status: string;
  is_priority: boolean;
  report_type: AnnouncementReportType | null;
  animal_type: AnnouncementAnimalType | null;
  age: AnnouncementAge | null;
  gender: AnnouncementGender | null;
  neutered: AnnouncementBinaryChoice | null;
  vaccination: AnnouncementVaccinationStatus | null;
  health_status: AnnouncementHealthStatus | null;
  environment: AnnouncementEnvironment | null;
  created_at: string | null;
  updated_at: string | null;
  author: AnnouncementAuthorRecord;
  images: AnnouncementImageRecord[];
};

export type AnnouncementFilters = {
  category?: AnnouncementCategory;
  city?: string;
  district?: string;
};

export type CreateAnnouncementInput = {
  category: AnnouncementCategory;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  locationDescription?: string | null;
  phone?: string | null;
  email?: string | null;
  images: string[];
  report_type?: AnnouncementReportType | null;
  animal_type?: AnnouncementAnimalType | null;
  age?: AnnouncementAge | null;
  gender?: AnnouncementGender | null;
  neutered?: AnnouncementBinaryChoice | null;
  vaccination?: AnnouncementVaccinationStatus | null;
  health_status?: AnnouncementHealthStatus | null;
  environment?: AnnouncementEnvironment | null;
};

export type UpdateAnnouncementInput = {
  category?: AnnouncementCategory;
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  locationDescription?: string | null;
  phone?: string | null;
  email?: string | null;
  images?: string[];
  report_type?: AnnouncementReportType | null;
  animal_type?: AnnouncementAnimalType | null;
  age?: AnnouncementAge | null;
  gender?: AnnouncementGender | null;
  neutered?: AnnouncementBinaryChoice | null;
  vaccination?: AnnouncementVaccinationStatus | null;
  health_status?: AnnouncementHealthStatus | null;
  environment?: AnnouncementEnvironment | null;
};
