# Elan — React + Supabase One-Page Landing

Versi ini adalah landing page 1 halaman. Menu navbar hanya melakukan smooth scroll ke section:

- About Us -> `#about`
- Product -> `#products`
- Event -> `#event`

Tidak ada routing `/about`, `/products`, atau `/event`.

## Fitur

- React JS + Vite
- One-page landing page
- Smooth scroll navbar
- Produk dari Supabase
- Cart dan checkout tetap di halaman yang sama
- Order masuk ke Supabase
- Upload bukti pembayaran ke Supabase Storage
- QRIS statis
- Konfirmasi WhatsApp

## Install

```bash
npm install
```

## Env

Copy file:

```bash
cp .env.example .env
```

Isi:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WHATSAPP_OWNER=6281234567890
VITE_QRIS_IMAGE_URL=
VITE_ELAN_LOGO_URL=
```

## Supabase

1. Buka Supabase Project
2. Masuk SQL Editor
3. Copy isi `supabase/schema.sql`
4. Run

## Run local

```bash
npm run dev
```

Buka:

```txt
http://localhost:5173
```

## Build production

```bash
npm run build
```
