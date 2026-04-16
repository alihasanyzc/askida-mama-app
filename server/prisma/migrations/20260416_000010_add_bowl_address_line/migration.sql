ALTER TABLE "public"."bowls"
ADD COLUMN "address_line" VARCHAR(200);

ALTER TABLE "public"."bowl_status_logs"
ADD COLUMN "new_address_line" VARCHAR(200);
