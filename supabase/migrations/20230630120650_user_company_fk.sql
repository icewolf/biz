CREATE TABLE public.company_users(
  "company_id" uuid REFERENCES public.company ON DELETE CASCADE NOT NULL,
  "user_id" uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  "role" text NOT NULL CHECK (ROLE IN ('admin', 'user')),
  "created_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone NOT NULL,
  PRIMARY KEY ("company_id", "user_id")
);

ALTER TABLE public.user
  DROP COLUMN ROLE;

