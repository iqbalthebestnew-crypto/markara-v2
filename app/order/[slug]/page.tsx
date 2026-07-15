"use client";

import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatRupiah } from "@/lib/format";
import type { Package, Profile } from "@/lib/types";

export default function OrderPage() {
  return (
    <AuthGuard>
      <OrderForm />
    </AuthGuard>
  );
}

function OrderForm() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const [{ data: packageData }, { data: authData }] = await Promise.all([
        supabase.from("packages").select("*").eq("slug", params.slug).single(),
        supabase.auth.getUser(),
      ]);
      setPkg(packageData as Package);
      if (authData.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single();
        setProfile(profileData as Profile);
      }
    }
    load();
  }, [params.slug]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pkg || !profile) return;
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    const { data: code, error: codeError } = await supabase.rpc("make_order_code");

    if (codeError) {
      setError(codeError.message);
      setLoading(false);
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_code: code,
        customer_id: profile.id,
        package_id: pkg.id,
        customer_name: String(form.get("customer_name")),
        customer_email: String(form.get("customer_email")),
        customer_phone: String(form.get("customer_phone")),
        brand_name: String(form.get("brand_name")),
        business_field: String(form.get("business_field")),
        target_market: String(form.get("target_market")),
        logo_style: String(form.get("logo_style")),
        message: String(form.get("message")),
        deadline: form.get("deadline") || null,
      })
      .select("id")
      .single();

    if (orderError) {
      setError(orderError.message);
      setLoading(false);
      return;
    }

    router.push(`/summary?order=${order.id}`);
  }

  if (!pkg || !profile) {
    return <div className="page container" style={{ paddingTop: 150 }}>Memuat formulir…</div>;
  }

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container order-layout">
          <aside className="card package-info">
            <span className="badge">{pkg.name}</span>
            <h1>{pkg.name}</h1>
            <p>{pkg.description}</p>
            <strong>{formatRupiah(pkg.min_price)} – {formatRupiah(pkg.max_price)}</strong>
          </aside>

          <form className="card order-form form-grid" onSubmit={submit}>
            <div>
              <p className="eyebrow">Mulai proyek</p>
              <h2>Lengkapi kebutuhan logo Anda.</h2>
            </div>
            {error && <div className="error">{error}</div>}

            <div className="two">
              <div className="field"><label>Nama</label><input className="input" name="customer_name" required defaultValue={profile.full_name ?? ""} /></div>
              <div className="field"><label>Email</label><input className="input" type="email" name="customer_email" required defaultValue={profile.email ?? ""} /></div>
            </div>
            <div className="two">
              <div className="field"><label>Nomor WhatsApp</label><input className="input" name="customer_phone" required defaultValue={profile.phone ?? ""} /></div>
              <div className="field"><label>Nama brand</label><input className="input" name="brand_name" required /></div>
            </div>
            <div className="two">
              <div className="field"><label>Bidang usaha</label><input className="input" name="business_field" required /></div>
              <div className="field"><label>Target pasar</label><input className="input" name="target_market" required /></div>
            </div>
            <div className="two">
              <div className="field"><label>Gaya logo</label><input className="input" name="logo_style" placeholder="Minimalis, bold, elegan..." /></div>
              <div className="field"><label>Deadline</label><input className="input" name="deadline" type="date" /></div>
            </div>
            <div className="field"><label>Pesan dan brief</label><textarea className="input" name="message" required placeholder="Ceritakan konsep, warna, nilai brand, dan kebutuhan Anda." /></div>
            <button className="button button-primary" disabled={loading}>
              {loading ? "Menyimpan pesanan…" : "Lanjut ke Ringkasan"}
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        .order-layout { display: grid; grid-template-columns: .65fr 1.35fr; gap: 24px; align-items: start; }
        .package-info { padding: 30px; position: sticky; top: 100px; }
        .package-info h1 { font: 800 2.5rem Manrope; }
        .package-info p { color: var(--muted); }
        .package-info strong { display: block; margin-top: 30px; color: var(--gold-light); }
        .order-form { padding: 35px; }
        h2 { font: 800 2.5rem Manrope; margin: 8px 0 0; }
        .two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:800px) { .order-layout { grid-template-columns: 1fr; } .package-info { position: static; } }
        @media(max-width:600px) { .two { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
