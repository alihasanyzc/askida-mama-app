import type { NavigatorScreenParams } from '@react-navigation/native';

import type {
  AnnouncementRecord,
  BowlRecord,
  ClinicRecord,
  EventRecord,
  PostRecord,
  ProductRecord,
  ProfileRecord,
  UserProfilePreview,
} from './domain';

export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  CreatePost: undefined;
  Search: undefined;
  UserProfile: { user?: Partial<ProfileRecord> | UserProfilePreview } | undefined;
  Followers: { username: string; activeTab?: 'followers' | 'following' };
};

export type MapStackParamList = {
  MapMain: undefined;
  Donation: { type?: 'food' | 'medical'; amount?: number } | undefined;
  MedicalDonation: undefined;
  ProductDetail:
    | {
        productId?: string;
        product?: Partial<ProductRecord>;
        products?: Partial<ProductRecord>[];
        initialIndex?: number;
      }
    | undefined;
  QRScanner: undefined;
  BowlDetail: { bowl?: Partial<BowlRecord> } | undefined;
  EditAddress: { bowl?: Partial<BowlRecord> } | undefined;
  Payment: { amount?: number; selectedPaymentMethodId?: string } | undefined;
  AddPaymentMethod: { amount?: number } | undefined;
  ClinicDetail: { clinic?: Partial<ClinicRecord> } | undefined;
};

export type AnnouncementStackParamList = {
  AnnouncementMain: undefined;
  CreateAnnouncement: undefined;
  AnnouncementDetail: {
    announcement: Partial<AnnouncementRecord> & {
      image?: string;
      tag?: string;
      tagColor?: string;
      time?: string;
      location?: string;
      isOwner?: boolean;
      animalInfo?: {
        type?: string;
        age?: string;
        gender?: string;
        neutered?: string;
        vaccination?: string;
        environment?: string;
        healthStatus?: string;
      };
    };
  };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Followers: { username: string; activeTab?: 'followers' | 'following' };
  EditProfile: { user?: Partial<ProfileRecord> } | undefined;
  Privacy: undefined;
  About: undefined;
  Help: undefined;
  EventsList: undefined;
  EventDetail: { event?: Partial<EventRecord> } | undefined;
  ProfilePostFeed: {
    posts?: Array<{
      id: string;
      author: {
        id?: string;
        name: string;
        avatar: string;
      };
      date: string;
      image: string;
      title?: string;
      description: string;
      likes?: number;
      comments?: number;
      category?: string;
      isSaved?: boolean;
    }>;
    initialIndex?: number;
    source?: 'posts' | 'saved';
  } | undefined;
};

export type RootTabParamList = {
  Kesfet: NavigatorScreenParams<DiscoverStackParamList>;
  Harita: NavigatorScreenParams<MapStackParamList>;
  Chatbot: undefined;
  Ilan: NavigatorScreenParams<AnnouncementStackParamList>;
  Profil: NavigatorScreenParams<ProfileStackParamList>;
};
