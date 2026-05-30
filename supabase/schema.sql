-- Enable UUID generation
create extension if not exists "pgcrypto";

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price integer not null default 0,
  description text not null,
  short text,
  options_label text not null default 'Variant',
  notes_label text,
  notes_placeholder text,
  pricing_mode text not null default 'fixed',
  bead_price integer,
  default_beads integer not null default 18,
  variants jsonb not null default '[]'::jsonb,
  requires_notes boolean not null default false,
  images jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products
add column if not exists notes_label text;

alter table public.products
add column if not exists notes_placeholder text;

alter table public.products
add column if not exists pricing_mode text not null default 'fixed';

alter table public.products
add column if not exists bead_price integer;

alter table public.products
add column if not exists default_beads integer not null default 18;

-- ORDERS
create table if not exists public.orders (
  id uuid primary key,
  customer_name text not null,
  whatsapp_number text,
  total integer not null default 0,
  status text not null default 'pending',
  payment_proof_path text,
  created_at timestamptz not null default now()
);

-- ORDER ITEMS
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text,
  name text not null,
  variant text,
  qty integer not null default 1,
  price integer not null default 0,
  bead_count integer,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.order_items
add column if not exists bead_count integer;

-- STORAGE BUCKET FOR PAYMENT PROOFS
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

-- Make existing payment proof bucket public so WhatsApp can open the proof link
update storage.buckets
set public = true
where id = 'payment-proofs';

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon
using (is_active = true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders
for insert
to anon
with check (true);

drop policy if exists "Public can create order items" on public.order_items;
create policy "Public can create order items"
on public.order_items
for insert
to anon
with check (true);

drop policy if exists "Public can upload payment proofs" on storage.objects;
create policy "Public can upload payment proofs"
on storage.objects
for insert
to anon
with check (bucket_id = 'payment-proofs');

drop policy if exists "Public can read uploaded payment proofs" on storage.objects;
create policy "Public can read uploaded payment proofs"
on storage.objects
for select
to anon
using (bucket_id = 'payment-proofs');

-- SEED PRODUCTS
insert into public.products
  (
    slug,
    name,
    price,
    description,
    short,
    options_label,
    notes_label,
    notes_placeholder,
    pricing_mode,
    bead_price,
    default_beads,
    variants,
    requires_notes,
    images
  )
values
  (
    'beads-color-bracelet',
    'Beads Color Bracelet',
    50000,
    'Handcrafted color beads bracelet with 18 beads. Custom color requests are available at the same price.',
    'Color beads bracelet, 18 beads, with custom color option.',
    'Color',
    'Custom Color Notes',
    'Optional. Write your custom color request. Example: Dark blue and gray combination.',
    'fixed',
    null,
    18,
    '["Dark Blue", "Gray", "Black", "Light Blue", "Green", "Orange", "Red", "Yellow", "Custom Color"]',
    false,
    '[
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
    ]'
  ),
  (
    'custom-initial-bracelet',
    'Custom Initial Bracelet',
    2500,
    'Personal initial bracelet priced per bead. Choose the number of beads and write your custom color and initials.',
    'Initial bracelet, custom color, priced per bead.',
    'Base Style',
    'Custom Color & Initial Notes',
    'Required. Write your desired bracelet color and initials. Example: Dark blue bracelet with initials A and N.',
    'per_bead',
    2500,
    18,
    '["Initial Bracelet"]',
    true,
    '[
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80"
    ]'
  ),
  (
    'character-bracelet',
    'Character Bracelet',
    2500,
    'Character bracelet priced per bead. Choose Star, Moon, or Doll, then write your custom color notes.',
    'Character bracelet with Star, Moon, or Doll, priced per bead.',
    'Character',
    'Custom Color Notes',
    'Required. Write your desired bracelet color. Example: Black bracelet with Star character.',
    'per_bead',
    2500,
    18,
    '["Star", "Moon", "Doll"]',
    true,
    '[
      "https://images.unsplash.com/photo-1588444650733-d0767b753fc8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1620656798579-1984d9e87df3?auto=format&fit=crop&w=900&q=80"
    ]'
  )
on conflict (slug) do update set
  name = excluded.name,
  price = excluded.price,
  description = excluded.description,
  short = excluded.short,
  options_label = excluded.options_label,
  notes_label = excluded.notes_label,
  notes_placeholder = excluded.notes_placeholder,
  pricing_mode = excluded.pricing_mode,
  bead_price = excluded.bead_price,
  default_beads = excluded.default_beads,
  variants = excluded.variants,
  requires_notes = excluded.requires_notes,
  images = excluded.images,
  is_active = true;
