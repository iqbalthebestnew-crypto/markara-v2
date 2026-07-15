"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        data: {
          full_name: String(form.get("full_name")),
          phone: String(form.get("phone")),
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError("Akun dibuat. Silakan konfirmasi email atau matikan Confirm Email untuk mode development.");
      setLoading(false);
      return;
    }

    router.push("/customer");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <main className="page auth-page">
        <form className="card auth-card form-grid" onSubmit={submit}>
          <p className="eyebrow">Akun pelanggan</p>
          <h1>Daftar ke MARKARA</h1>
          {error && <div className="error">{error}</div>}
          <div className="field">
            <label>Nama lengkap</label>
            <input className="input" name="full_name" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input className="input" name="email" type="email" required />
          </div>
          <div className="field">
            <label>Nomor WhatsApp</label>
            <input className="input" name="phone" required placeholder="08..." />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" name="password" type="password" minLength={6} required />
          </div>
          <button className="button button-primary" disabled={loading}>
            {loading ? "Membuat akun…" : "Daftar"}
          </button>
          <p className="text-muted">Sudah punya akun? <Link className="gold" href="/login">Login</Link></p>
        </form>
      </main>
      <style jsx>{`
        .auth-page { display: grid; place-items: center; padding: 120px 18px 60px; }
        .auth-card { width: min(600px, 100%); padding: 38px; }
        h1 { font: 800 clamp(2rem, 6vw, 3rem) Manrope; margin: 0 0 12px; }
      `}</style>
    </>
  );
}
