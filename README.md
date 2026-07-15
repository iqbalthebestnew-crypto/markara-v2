# MARKARA v2 — Next.js + Supabase

Aplikasi full-stack untuk website publik, pemesanan logo, dashboard pelanggan, dan dashboard admin MARKARA.

## 1. Persiapan lokal

1. Install Node.js LTS.
2. Buka folder project di terminal.
3. Jalankan:

```bash
npm install
```

4. Salin `.env.example` menjadi `.env.local`.
5. Ganti `NEXT_PUBLIC_WHATSAPP_NUMBER`.
6. Jalankan:

```bash
npm run dev
```

7. Buka `http://localhost:3000`.

## 2. Deploy ke Vercel

1. Push seluruh project ke repository GitHub.
2. Buka Vercel dan pilih **Add New → Project**.
3. Import repository `markara-v2`.
4. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Klik **Deploy**.

## 3. Database

Project memakai tabel Supabase yang sudah dibuat:

- profiles
- packages
- orders
- order_progress
- revisions
- project_files
- order_activities

Jangan jalankan ulang schema lama jika semua tabel sudah tersedia.

## 4. Menjadikan akun admin

Setelah akun dibuat, jalankan di Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'EMAIL_ADMIN_ANDA';
```

Logout lalu login kembali.
