create table public.tourist_spots (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  description text not null,
  spot_type public.tourist_spot_type not null,
  address text not null,
  city text not null default 'Naga City'::text,
  province text not null default 'Camarines Sur'::text,
  location geography not null,
  google_maps_place_id text null,
  contact_phone text null,
  contact_email text null,
  website text null,
  opening_time time without time zone null,
  closing_time time without time zone null,
  entry_fee numeric(10, 2) null,
  status public.tourist_spot_status not null default 'pending'::tourist_spot_status,
  is_featured boolean not null default false,
  average_rating numeric(3, 2) null,
  review_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid null,
  updated_by uuid null,
  picture text null default 'https://thumb.ac-illust.com/b1/b170870007dfa419295d949814474ab2_t.jpeg'::text,
  constraint tourist_spots_pkey primary key (id),
  constraint tourist_spots_created_by_fkey foreign KEY (created_by) references profiles (id) on delete set null,
  constraint tourist_spots_updated_by_fkey foreign KEY (updated_by) references profiles (id) on delete set null
) TABLESPACE pg_default;

create table public.tourist_spot_edits (
  id uuid not null default extensions.uuid_generate_v4(),
  spot_id uuid not null,
  name text not null,
  description text not null,
  spot_type public.tourist_spot_type not null,
  address text not null,
  city text not null default 'Naga City'::text,
  province text not null default 'Camarines Sur'::text,
  location geography not null,
  google_maps_place_id text null,
  contact_phone text null,
  contact_email text null,
  website text null,
  opening_time time without time zone null,
  closing_time time without time zone null,
  entry_fee numeric(10, 2) null,
  status public.tourist_spot_status not null default 'pending'::tourist_spot_status,
  picture text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid null,
  constraint tourist_spot_edits_pkey primary key (id),
  constraint tourist_spot_edits_spot_id_fkey foreign key (spot_id) references tourist_spots(id) on delete cascade,
  constraint tourist_spot_edits_created_by_fkey foreign key (created_by) references profiles(id) on delete set null
) TABLESPACE pg_default;

create table public.tourist_spot_deletes (
  id uuid not null default extensions.uuid_generate_v4(),
  spot_id uuid not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid null,
  status public.tourist_spot_status not null default 'pending'::tourist_spot_status,
  constraint tourist_spot_deletes_pkey primary key (id),
  constraint tourist_spot_deletes_spot_id_fkey foreign key (spot_id) references tourist_spots(id) on delete cascade,
  constraint tourist_spot_deletes_created_by_fkey foreign key (created_by) references profiles(id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_tourist_spots_location on public.tourist_spots using gist (location) TABLESPACE pg_default;

create index IF not exists idx_tourist_spots_status on public.tourist_spots using btree (status) TABLESPACE pg_default;

create index IF not exists idx_tourist_spots_type on public.tourist_spots using btree (spot_type) TABLESPACE pg_default;

create index IF not exists idx_tourist_spot_edits_spot_id on public.tourist_spot_edits using btree (spot_id) TABLESPACE pg_default;

create index IF not exists idx_tourist_spot_edits_status on public.tourist_spot_edits using btree (status) TABLESPACE pg_default;

create index IF not exists idx_tourist_spot_deletes_spot_id on public.tourist_spot_deletes using btree (spot_id) TABLESPACE pg_default;

create index IF not exists idx_tourist_spot_deletes_status on public.tourist_spot_deletes using btree (status) TABLESPACE pg_default;