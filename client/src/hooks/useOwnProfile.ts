import { useCallback, useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import { getOwnProfile, OwnProfileRecord } from '../services/profiles';
import type { ProfileRecord } from '../types/domain';

type HydratableProfile = Partial<ProfileRecord> & {
  id: string;
  full_name: string;
  username: string;
  phone?: string | null;
};

const listeners = new Set<(profile: OwnProfileRecord | null) => void>();
let cachedProfile: OwnProfileRecord | null = null;
let hasLoadedProfile = false;

const notifyListeners = (profile: OwnProfileRecord | null) => {
  listeners.forEach((listener) => listener(profile));
};

const isServiceUnavailableError = (error: unknown) =>
  error instanceof AxiosError && error.response?.status === 503;

function updateCachedProfile(profile: OwnProfileRecord | null, options?: { hasLoadedProfile?: boolean }) {
  cachedProfile = profile;

  if (typeof options?.hasLoadedProfile === 'boolean') {
    hasLoadedProfile = options.hasLoadedProfile;
  }

  notifyListeners(cachedProfile);
}

export const loadOwnProfile = async () => {
  updateCachedProfile(await getOwnProfile(), { hasLoadedProfile: true });
  return cachedProfile;
};

export const setCachedOwnProfile = (profile: OwnProfileRecord | null) => {
  updateCachedProfile(profile, { hasLoadedProfile: true });
};

export const clearCachedOwnProfile = () => {
  updateCachedProfile(null, { hasLoadedProfile: false });
};

export const hydrateCachedOwnProfile = (profile: HydratableProfile | null | undefined) => {
  if (!profile) {
    return;
  }

  updateCachedProfile({
    ...profile,
    name: profile.name ?? profile.full_name,
    avatar: profile.avatar ?? profile.avatar_url ?? null,
    cover_photo: profile.cover_photo ?? profile.cover_photo_url ?? null,
    avatar_url: profile.avatar_url ?? null,
    cover_photo_url: profile.cover_photo_url ?? null,
    bio: profile.bio ?? null,
    phone: profile.phone ?? null,
    role: profile.role ?? 'user',
    created_at: profile.created_at ?? null,
    updated_at: profile.updated_at ?? null,
    followers_count: profile.stats?.followers ?? 0,
    following_count: profile.stats?.following ?? 0,
    posts_count: profile.stats?.posts ?? 0,
    posts: [],
    announcements: [],
    saved_posts: [],
  }, { hasLoadedProfile: false });
};

export const useOwnProfile = () => {
  const [profile, setProfile] = useState<OwnProfileRecord | null>(cachedProfile);
  const [isLoading, setIsLoading] = useState(!hasLoadedProfile);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadOwnProfile();
      setError(null);
    } catch (refreshError) {
      setError(refreshError);
      if (!isServiceUnavailableError(refreshError)) {
        console.error('Own profile refresh error:', refreshError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    listeners.add(setProfile);

    if (!hasLoadedProfile) {
      void refresh();
    } else {
      setProfile(cachedProfile);
      setIsLoading(false);
    }

    return () => {
      listeners.delete(setProfile);
    };
  }, [refresh]);

  return { profile, isLoading, error, refresh };
};
