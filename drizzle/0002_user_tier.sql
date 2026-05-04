ALTER TABLE "users" ADD COLUMN "tier" text NOT NULL DEFAULT 'free';
ALTER TABLE "users" ADD CONSTRAINT "users_tier_check" CHECK ("tier" IN ('free', 'pro'));
