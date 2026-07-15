"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatDate, formatRupiah, statusLabel } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function SummaryPage() {
  return (
    <AuthGuard>
      <Summary />
    </AuthGuard>
  );
}

function Summary() {
  const search = useSearchParams();
  const orderId = search.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!orderId) return setError("ID pesanan tidak ditemukan.");
      const { data, error } = await getSupabaseBrowserClient()
        .from("orders")
        .select("*, packages(*)")
        .eq("id", orderId)
        .single();
      if (error) setError(error.message);
      else setOrder(data as unknown as Order);
    }
    load();
  }, [orderId]);

  function sendWhatsApp() {
    if (!order) return;
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
    const message = [
      "Halo MARKARA, saya sudah membuat pesanan.",
      "",
      `Kode: ${order.order_code}`,
      `Nama: ${order.customer_name}`,
      `Email: ${order.customer_email}`,
      `WhatsApp: ${order.customer_phone ?? "-"}`,
      `Brand: ${order.brand_name ?? "-"}`,
      `Paket: ${order.packages?.name ?? "-"}`,
      `Kisaran harga: ${formatRupiah(order.packages?.min_price)} - ${formatRupiah(order.packages?.max_price)}`,
      `Bidang: ${order.business_field ?? "-"}`,
      `Target: ${order.target_market ?? "-"}`,
      `Gaya: ${order.logo_style ?? "-"}`,
      `Deadline: ${formatDate(order.deadline)}`,
      `Brief: ${order.message}`,
      "",
      "Mohon konfirmasi kelanjutan proyek. Terima kasih.",
    ].join("\n");

    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container summary">
          {error && <div className="error">{error}</div>}
          {!order && !error && <div className="empty">Memuat ringkasan…</div>}
          {order && (
            <div className="card summary-card">
              <p className="eyebrow">Pesanan berhasil dibuat</p>
              <h1>{order.order_code}</h1>
              <span className="badge">{statusLabel(order.status)}</span>
              <div className="details">
                <Row label="Nama" value={order.customer_name} />
                <Row label="Paket" value={order.packages?.name ?? "-"} />
                <Row label="Brand" value={order.brand_name ?? "-"} />
                <Row label="Bidang usaha" value={order.business_field ?? "-"} />
                <Row label="Target pasar" value={order.target_market ?? "-"} />
                <Row label="Gaya logo" value={order.logo_style ?? "-"} />
                <Row label="Deadline" value={formatDate(order.deadline)} />
                <Row label="Brief" value={order.message} />
              </div>
              <button className="button button-primary" onClick={sendWhatsApp}>
                <MessageCircle size={18} /> Kirim Rincian melalui WhatsApp
              </button>
            </div>
          )}
        </div>
      </main>
      <style jsx>{`
        .summary { max-width: 780px; }
        .summary-card { padding: 40px; }
        h1 { font: 800 clamp(2.3rem, 6vw, 4rem) Manrope; margin: 5px 0 14px; }
        .details { margin: 35px 0; border-top: 1px solid var(--border); }
      `}</style>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 20, padding: "15px 0", borderBottom: "1px solid var(--border)" }}>
      <strong>{label}</strong>
      <span className="text-muted">{value}</span>
    </div>
  );
}
