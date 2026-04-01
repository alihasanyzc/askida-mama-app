ALTER TABLE public.announcements
ALTER COLUMN phone DROP NOT NULL;

ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS email VARCHAR(150);

CREATE INDEX IF NOT EXISTS idx_announcements_category
ON public.announcements(category);

CREATE INDEX IF NOT EXISTS idx_announcements_city
ON public.announcements(city);

CREATE INDEX IF NOT EXISTS idx_announcements_district
ON public.announcements(district);

CREATE INDEX IF NOT EXISTS idx_announcements_user_id_created_at
ON public.announcements(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_is_priority_created_at
ON public.announcements(is_priority DESC, created_at DESC);
