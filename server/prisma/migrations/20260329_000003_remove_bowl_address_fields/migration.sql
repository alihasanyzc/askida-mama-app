ALTER TABLE public.bowls
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS district;

ALTER TABLE public.bowl_status_logs
DROP COLUMN IF EXISTS new_address;
