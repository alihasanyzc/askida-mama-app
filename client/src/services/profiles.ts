import api, { ApiSuccessResponse } from './api';
import type { AnnouncementRecord, PostRecord, ProfileRecord } from '../types/domain';

export type OwnProfileRecord = ProfileRecord & {
  name: string;
  avatar: string | null;
  cover_photo: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  posts: PostRecord[];
  announcements: AnnouncementRecord[];
  saved_posts: PostRecord[];
};

export type ProfileSearchRecord = {
  id: string;
  full_name: string;
  name: string;
  username: string;
  avatar_url: string | null;
  avatar: string | null;
  bio: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following: boolean;
  is_self: boolean;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
};

export type PublicProfileRecord = ProfileRecord & {
  name: string;
  avatar: string | null;
  cover_photo: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_following: boolean;
  is_own_profile: boolean;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
};

export type UpdateProfileInput = {
  full_name?: string;
  username?: string;
  bio?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  cover_photo_url?: string | null;
};

type UploadProfileImageResponse = {
  image_url: string;
  profile: ProfileRecord;
};

function inferImageMimeType(uri: string) {
  const extension = uri.split('?')[0]?.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'jpg':
    case 'jpeg':
    default:
      return 'image/jpeg';
  }
}

function inferImageName(uri: string, prefix: string) {
  const rawName = uri.split('?')[0]?.split('/').pop();
  return rawName && rawName.includes('.') ? rawName : `${prefix}-${Date.now()}.jpg`;
}

function buildImageFormData(uri: string, prefix: string) {
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: inferImageName(uri, prefix),
    type: inferImageMimeType(uri),
  } as unknown as Blob);

  return formData;
}

export async function getOwnProfile() {
  const response =
    (await api.get<ApiSuccessResponse<OwnProfileRecord>>('/profiles/me')) as unknown as ApiSuccessResponse<
      OwnProfileRecord
    >;

  return response.data;
}

export async function searchProfiles(query: string) {
  const response =
    (await api.get<ApiSuccessResponse<ProfileSearchRecord[]>>('/profiles/search', {
      params: {
        q: query,
      },
    })) as unknown as ApiSuccessResponse<ProfileSearchRecord[]>;

  return response.data;
}

export async function updateOwnProfile(input: UpdateProfileInput) {
  const response =
    (await api.patch<ApiSuccessResponse<ProfileRecord>>('/profiles/me', input)) as unknown as ApiSuccessResponse<
      ProfileRecord
    >;

  return response.data;
}

export async function followProfile(profileId: string) {
  const response =
    (await api.post<ApiSuccessResponse<PublicProfileRecord>>(
      `/profiles/${profileId}/follow`,
    )) as unknown as ApiSuccessResponse<PublicProfileRecord>;

  return response.data;
}

export async function unfollowProfile(profileId: string) {
  const response =
    (await api.delete<ApiSuccessResponse<PublicProfileRecord>>(
      `/profiles/${profileId}/follow`,
    )) as unknown as ApiSuccessResponse<PublicProfileRecord>;

  return response.data;
}

export async function uploadProfileAvatar(uri: string) {
  const response = (await api.post<ApiSuccessResponse<UploadProfileImageResponse>>(
    '/profiles/me/avatar',
    buildImageFormData(uri, 'avatar'),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )) as unknown as ApiSuccessResponse<UploadProfileImageResponse>;

  return response.data;
}

export async function uploadProfileCoverPhoto(uri: string) {
  const response = (await api.post<ApiSuccessResponse<UploadProfileImageResponse>>(
    '/profiles/me/cover-photo',
    buildImageFormData(uri, 'cover'),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )) as unknown as ApiSuccessResponse<UploadProfileImageResponse>;

  return response.data;
}
