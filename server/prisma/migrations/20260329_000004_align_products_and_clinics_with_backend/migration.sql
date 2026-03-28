ALTER TABLE public.products
RENAME COLUMN category TO animal_type;

ALTER TABLE public.products
RENAME COLUMN price_per_kg TO price;

ALTER TABLE public.products
DROP COLUMN IF EXISTS weight;

ALTER TABLE public.clinics
DROP COLUMN IF EXISTS address;

ALTER TABLE public.clinics
RENAME COLUMN location_note TO location_description;
