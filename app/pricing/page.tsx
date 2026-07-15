"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatRupiah } from "@/lib/format";
import type { Package } from "@/lib/types";

export default function PricingPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error } = await getSupabaseBrowserClient()
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) setError(error.message);
      else setPackages((data ?? []) as Package[]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <p className="eyebrow">Paket harga</p>
          <h1 className="heading">Pilih solusi sesuai tahap perkembangan brand Anda.</h1>
          <p className="intro">Semua paket diambil langsung dari database Supabase.</p>

          {loading && <div className="empty">Memuat paket…</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && packages.length === 0 && (
            <div className="empty">Belum ada paket aktif di database.</div>
          )}

          <div className="pricing-grid">
            {packages.map((pkg) => (
              <article className="card card-hover price-card" key={pkg.id}>
                <span className="badge">{pkg.name}</span>
                <p className="text-muted">{pkg.description}</p>
                <h2>{formatRupiah(pkg.min_price)} – {formatRupiah(pkg.max_price)}</h2>
                <ul>
                  {(Array.isArray(pkg.features) ? pkg.features : []).map((feature) => (
                    <li key={feature}><Check size={17} className="gold" /> {feature}</li>
                  ))}
                </ul>
                <Link className="button button-primary" href={`/order/${pkg.slug}`}>
                  Pilih paket <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <style jsx>{`
        .intro { color: var(--muted); margin: 22px 0 45px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .price-card { padding: 28px; display: flex; flex-direction: column; }
        h2 { font: 800 1.55rem Manrope; min-height: 75px; }
        ul { list-style: none; padding: 0; display: grid; gap: 13px; color: #c8c8c8; flex: 1; }
        li { display: flex; gap: 9px; align-items: flex-start; }
        @media(max-width:1000px) { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width:620px) { .pricing-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
