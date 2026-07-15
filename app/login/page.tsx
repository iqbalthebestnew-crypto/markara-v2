"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Profile } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (authError || !data.user) {
      setError(authError?.message ?? "Login gagal.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    router.push((profile as Profile).role === "admin" ? "/admin" : "/customer");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <main className="page auth-page">
        <form className="card auth-card form-grid" onSubmit={submit}>
          <p className="eyebrow">Selamat datang kembali</p>
          <h1>Masuk ke MARKARA</h1>
          {error && <div className="error">{error}</div>}
          <div className="field">
            <label>Email</label>
            <input className="input" name="email" type="email" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input className="input" name="password" type="password" required minLength={6} />
          </div>
          <button className="button button-primary" disabled={loading}>
            {loading ? "Memproses…" : "Login"}
          </button>
          <p className="text-muted">Belum punya akun? <Link className="gold" href="/register">Daftar di sini</Link></p>
        </form>
      </main>
      <style jsx>{`
        .auth-page { display: grid; place-items: center; padding-inline: 18px; }
        .auth-card { width: min(560px, 100%); padding: 38px; }
        h1 { font: 800 clamp(2rem, 6vw, 3rem) Manrope; margin: 0 0 12px; }
      `}</style>
    </>
  );
}
