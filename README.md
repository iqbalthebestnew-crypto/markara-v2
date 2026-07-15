# MARKARA Next.js + Supabase

Versi terstruktur untuk pengembangan MARKARA sebagai aplikasi profesional.

## Penting
- Database Supabase lama tetap dipakai. Jangan jalankan `schema.sql` lagi.
- Repository GitHub Pages lama jangan dihapus sampai versi Next.js berhasil online.
- Next.js sebaiknya dideploy ke Vercel; GitHub digunakan sebagai penyimpanan source code.

## Menjalankan di komputer
1. Install Node.js LTS.
2. Buka folder ini di VS Code.
3. Salin `.env.example` menjadi `.env.local`.
4. Ganti `NEXT_PUBLIC_WHATSAPP_NUMBER`.
5. Jalankan:
   ```bash
   npm install
   npm run dev
   ```
6. Buka `http://localhost:3000`.

## Upload GitHub
Buat repository baru, misalnya `markara-next`, lalu upload semua file proyek ini.

## Deploy Vercel
1. Login ke Vercel menggunakan GitHub.
2. Klik **Add New → Project**.
3. Import repository `markara-next`.
4. Tambahkan Environment Variables dari `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
5. Klik **Deploy**.
6. Salin URL Vercel dan masukkan ke Supabase → Authentication → URL Configuration.

## Route
- `/` landing + pricing
- `/login`
- `/register`
- `/order/[slug]`
- `/dashboard`
- `/admin`
