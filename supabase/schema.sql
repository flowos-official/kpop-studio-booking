-- K-POP Studio Booking - Database Schema
-- Run this in the Supabase SQL Editor to set up the database

-- Users extended profile
create table if not exists profiles (
  id uuid references auth.users primary key,
  full_name text,
  role text default 'artist' check (role in ('artist', 'admin', 'manager')),
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Spaces (studios/rooms)
create table if not exists spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('recording', 'practice', 'both')),
  description text,
  equipment text[],
  hourly_rate integer not null,
  capacity integer default 1,
  photos text[],
  address text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Programs (packages)
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references spaces(id) on delete cascade,
  name text not null,
  description text,
  duration_hours integer,
  price integer not null,
  includes text[],
  created_at timestamptz default now()
);

-- Artists
create table if not exists artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  name text not null,
  agency text,
  genre text,
  member_count integer default 1,
  bio text,
  profile_photo text,
  created_at timestamptz default now()
);

-- Bookings
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references spaces(id) on delete cascade,
  artist_id uuid references artists(id) on delete set null,
  user_id uuid references auth.users on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price integer,
  notes text,
  created_at timestamptz default now()
);

-- Payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  amount integer not null,
  method text,
  status text default 'pending' check (status in ('pending', 'paid', 'refunded', 'failed')),
  toss_payment_key text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table spaces enable row level security;
alter table programs enable row level security;
alter table artists enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;

-- RLS Policies
-- Profiles: users can read all, update own
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Spaces: everyone can read active spaces, admins can manage
create policy "Active spaces are viewable by everyone" on spaces for select using (is_active = true);
create policy "Admins can manage spaces" on spaces for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Programs: everyone can read
create policy "Programs are viewable by everyone" on programs for select using (true);

-- Artists: everyone can read
create policy "Artists are viewable by everyone" on artists for select using (true);
create policy "Users can manage own artist profile" on artists for all using (user_id = auth.uid());

-- Bookings: users can see own, admins can see all
create policy "Users can view own bookings" on bookings for select using (user_id = auth.uid());
create policy "Admins can view all bookings" on bookings for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager'))
);
create policy "Users can create bookings" on bookings for insert with check (auth.uid() = user_id);

-- Payments: users can see own, admins can see all
create policy "Users can view own payments" on payments for select using (
  exists (select 1 from bookings where bookings.id = payments.booking_id and bookings.user_id = auth.uid())
);
create policy "Admins can view all payments" on payments for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager'))
);

-- Seed data
INSERT INTO spaces (name, type, description, equipment, hourly_rate, capacity, photos, address) VALUES
  ('녹음실 A - 프리미엄', 'recording', '최고급 장비를 갖춘 프리미엄 녹음실입니다.', ARRAY['Neumann U87', 'SSL Console', 'Pro Tools HDX', 'Genelec 8351B'], 150000, 6, ARRAY['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800'], '서울시 강남구 역삼동 123-45'),
  ('녹음실 B - 스탠다드', 'recording', '보컬 녹음에 특화된 스탠다드 녹음실입니다.', ARRAY['AKG C414', 'Focusrite Clarett', 'Logic Pro X', 'Yamaha HS8'], 80000, 4, ARRAY['https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800'], '서울시 마포구 합정동 67-89'),
  ('연습실 A - 대형', 'practice', '대형 그룹 연습에 적합한 넓은 연습실입니다.', ARRAY['JBL EON615 x4', '전면 거울벽', '우드 플로어', 'LED 조명'], 60000, 15, ARRAY['https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800'], '서울시 성동구 성수동 456-78'),
  ('스튜디오 C - 복합', 'both', '녹음과 연습을 동시에 할 수 있는 복합 스튜디오입니다.', ARRAY['Shure SM7B', 'Ableton Live', 'QSC K12.2 x2', '거울벽', '방음 부스'], 120000, 10, ARRAY['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800'], '서울시 용산구 이태원동 321-54');

INSERT INTO artists (name, agency, genre, member_count, bio, profile_photo) VALUES
  ('NOVA', 'Star Entertainment', 'K-POP / 댄스', 5, '2024년 데뷔한 5인조 보이그룹입니다.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'),
  ('LUNA', 'Dream Music', 'K-POP / R&B', 1, '독보적인 음색과 작사 능력을 겸비한 솔로 아티스트입니다.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'),
  ('PRISM', 'Bright Agency', 'K-POP / 힙합', 4, '힙합 기반의 음악을 하는 4인조 걸그룹입니다.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400');
