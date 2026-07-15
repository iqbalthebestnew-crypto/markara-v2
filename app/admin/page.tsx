"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import LogoutButton from "@/components/LogoutButton";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatDate, statusLabel } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function AdminPage() {
  return (
    <AuthGuard role="admin">
      <AdminDashboard />
    </AuthGuard>
  );
}

function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await getSupabaseBrowserClient()
        .from("orders")
        .select("*, packages(*)")
        .order("created_at", { ascending: false });
      setOrders((data ?? []) as unknown as Order[]);
      setLoading(false);
    }
    load();
  }, []);

  const stats = useMemo(() => ({
    total: orders.length,
    process: orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length,
    completed: orders.filter((o) => o.status === "completed").length,
    revision: orders.filter((o) => o.status === "revision").length,
  }), [orders]);

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <div className="dash-head">
            <div>
              <p className="eyebrow">Dashboard admin</p>
              <h1 className="heading">Kelola proyek MARKARA.</h1>
            </div>
            <LogoutButton />
          </div>

          <div className="stat-grid">
            <Stat label="Total order" value={stats.total} />
            <Stat label="Sedang diproses" value={stats.process} />
            <Stat label="Revisi" value={stats.revision} />
            <Stat label="Selesai" value={stats.completed} />
          </div>

          <section className="card table-card">
            <h2>Order terbaru</h2>
            {loading ? <div className="empty">Memuat order…</div> : (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Kode</th><th>Pelanggan</th><th>Brand</th><th>Paket</th><th>Status</th><th>Tanggal</th><th></th></tr></thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.order_code}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.brand_name ?? "-"}</td>
                        <td>{order.packages?.name ?? "-"}</td>
                        <td><span className="badge">{statusLabel(order.status)}</span></td>
                        <td>{formatDate(order.created_at)}</td>
                        <td><Link className="gold" href={`/admin/orders/${order.id}`}>Kelola</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
      <style jsx>{`
        .dash-head { display: flex; justify-content: space-between; gap: 30px; align-items: flex-start; }
        .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin: 40px 0; }
        .table-card { padding: 27px; }
        h2 { font: 800 1.5rem Manrope; }
        @media(max-width:800px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } .dash-head { flex-direction: column; } }
      `}</style>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <span className="text-muted">{label}</span>
      <strong style={{ display: "block", font: "800 2.5rem Manrope", marginTop: 12, color: "var(--gold-light)" }}>{value}</strong>
    </div>
  );
}
