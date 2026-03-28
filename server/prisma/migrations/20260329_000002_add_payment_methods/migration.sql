CREATE TABLE "payment_methods" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "brand" VARCHAR(20) NOT NULL,
  "last4" VARCHAR(4) NOT NULL,
  "cardholder_name" VARCHAR(120) NOT NULL,
  "expiry_month" INTEGER NOT NULL,
  "expiry_year" INTEGER NOT NULL,
  "card_type" VARCHAR(30),
  "is_default" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payment_methods_user_id_idx" ON "payment_methods"("user_id");

ALTER TABLE "payment_methods"
ADD CONSTRAINT "payment_methods_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "profiles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
