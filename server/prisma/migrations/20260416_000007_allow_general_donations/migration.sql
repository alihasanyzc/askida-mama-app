ALTER TABLE public.donations
DROP CONSTRAINT IF EXISTS donations_type_check;

ALTER TABLE public.donations
DROP CONSTRAINT IF EXISTS chk_donation_relation_match;

ALTER TABLE public.donations
ADD CONSTRAINT donations_type_check
CHECK (type IN ('food', 'medical', 'bowl', 'general'));

ALTER TABLE public.donations
ADD CONSTRAINT chk_donation_relation_match
CHECK (
  (type = 'food' AND product_id IS NOT NULL AND clinic_id IS NULL AND bowl_id IS NULL)
  OR
  (type = 'medical' AND clinic_id IS NOT NULL AND product_id IS NULL AND bowl_id IS NULL)
  OR
  (type = 'bowl' AND bowl_id IS NOT NULL AND product_id IS NULL AND clinic_id IS NULL)
  OR
  (type = 'general' AND product_id IS NULL AND clinic_id IS NULL AND bowl_id IS NULL)
);
