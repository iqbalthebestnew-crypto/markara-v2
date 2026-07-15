"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import LogoutButton from "@/components/LogoutButton";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatDate, statusLabel } from "@/lib/format";
import type { Order, Profile } from "@/lib/types";

export default function CustomerPage() {
  return (
    <AuthGuard role="customer">
      <Dashboard />
    </AuthGuard>
  );
}

function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const [{ data: profileData }, { data: orderData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", auth.user.id).single(),
        supabase.from("orders").select("*, packages(*)").eq("customer_id", auth.user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(profileData as Profile);
      setOrders((orderData ?? []) as unknown as Order[]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <div className="dash-head">
            <div>
              <p className="eyebrow">Dashboard pelanggan</p>
              <h1 className="heading">Halo, {profile?.full_name ?? "Pelanggan"}.</h1>
              <p className="text-muted">Pantau seluruh progres desain logo Anda di satu tempat.</p>
            </div>
            <LogoutButton />
          </div>

          {loading && <div className="empty">Memuat pesanan…</div>}
          {!loading && orders.length === 0 && (
            <div className="empty">
              Belum ada pesanan. <Link className="gold" href="/pricing">Pilih paket sekarang.</Link>
            </div>
          )}

          <div className="orders">
            {orders.map((order) => (
              <article className="card card-hover order-card" key={order.id}>
                <div className="order-top">
                  <div>
                    <span className="badge">{statusLabel(order.status)}</span>
                    <h2>{order.order_code}</h2>
                    <p>{order.brand_name ?? "Proyek logo"}</p>
                  </div>
                  <strong>{order.progress}%</strong>
                </div>
                <div className="progress"><span style={{ width: `${order.progress}%` }} /></div>
                <div className="meta">
                  <span>Paket: {order.packages?.name ?? "-"}</span>
                  <span>Dibuat: {formatDate(order.created_at)}</span>
                </div>
                <Link className="button button-outline" href={`/customer/orders/${order.id}`}>
                  Lihat proyek <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <style jsx>{`
        .dash-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 30px; margin-bottom: 45px; }
        .orders { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .order-card { padding: 27px; }
        .order-top { display: flex; justify-content: space-between; gap: 20px; }
        .order-top h2 { font: 800 1.55rem Manrope; margin: 13px 0 5px; }
        .order-top p { color: var(--muted); }
        .order-top > strong { font: 800 2rem Manrope; color: var(--gold-light); }
        .meta { display: flex; justify-content: space-between; gap: 15px; margin: 16px 0 25px; color: var(--muted); font-size: .82rem; }
        @media(max-width:760px) { .orders { grid-template-columns: 1fr; } .dash-head { flex-direction: column; } .meta { flex-direction: column; } }
      `}</style>
    </>
  );
}
