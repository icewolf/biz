CREATE TABLE public.user(
  "id" uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  "role" text NOT NULL CHECK (ROLE IN ('admin', 'user')),
  name text,
  "created_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone NOT NULL
);

ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
