export type EventRecord = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  organizer: string;
  event_date: string;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  district: string | null;
  location_note: string | null;
  status: string;
  is_active: boolean;
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
  creator: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  registrations_count: number;
  is_registered: boolean;
};

export type EventRegistrationStatus = 'pending' | 'approved' | 'rejected';

export type EventRegistrationRecord = {
  id: string;
  event_id: string;
  user_id: string;
  email: string;
  status: EventRegistrationStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string | null;
  email_notification: {
    status: 'sent' | 'skipped';
    reason?: string;
    provider?: string;
  };
};

export type CreateEventInput = {
  title: string;
  description: string;
  image_url: string;
  organizer: string;
  event_date: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  location_note?: string | null;
  locationDescription?: string | null;
};
