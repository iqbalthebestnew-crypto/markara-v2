"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatDate, statusLabel } from "@/lib/format";
import type { Order, ProgressItem, Revision } from "@/lib/types";

const statuses = ["process", "research", "concept", "revision", "finalization", "completed", "cancelled"];

export default function AdminOrderDetailPage() {
  return (
    <AuthGuard role="admin">
      <AdminDetail />
    </AuthGuard>
  );
}

function AdminDetail() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const supabase = getSupabaseBrowserClient();
    const [orderRes, progressRes, revisionRes] = await Promise.all([
      supabase.from("orders").select("*, packages(*)").eq("id", params.id).single(),
      supabase.from("order_progress").select("*").eq("order_id", params.id).order("sort_order"),
      supabase.from("revisions").select("*").eq("order_id", params.id).order("created_at", { ascending: false }),
    ]);
    setOrder(orderRes.data as unknown as Order);
    setProgress((progressRes.data ?? []) as ProgressItem[]);
    setRevisions((revisionRes.data ?? []) as Revision[]);
  }

  useEffect(() => { load(); }, [params.id]);

  async function updateOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const status = String(form.get("status"));
    const progressValue = Number(form.get("progress"));
    const supabase = getSupabaseBrowserClient();

    await supabase.from("orders").update({
      status,
      progress: progressValue,
      agreed_price: form.get("agreed_price") ? Number(form.get("agreed_price")) : null,
    }).eq("id", params.id);

    const { data: auth } = await supabase.auth.getUser();
    await supabase.from("order_activities").insert({
      order_id: params.id,
      actor_id: auth.user?.id ?? null,
      activity_type: "admin_update",
      description: `Status diperbarui menjadi ${statusLabel(status)} dengan progres ${progressValue}%.`,
    });

    load();
  }

  async function toggleStage(item: ProgressItem) {
    await getSupabaseBrowserClient()
      .from("order_progress")
      .update({
        is_completed: !item.is_completed,
        completed_at: !item.is_completed ? new Date().toISOString() : null,
      })
      .eq("id", item.id);
    load();
  }

  async function respondRevision(event: FormEvent<HTMLFormElement>, revision: Revision) {
    event.preventDefault();
    const response = new FormData(event.currentTarget).get("response");
    await getSupabaseBrowserClient()
      .from("revisions")
      .update({ admin_response: response, status: "reviewed" })
      .eq("id", revision.id);
    load();
  }

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploading(true);
    const form = new FormData(event.currentTarget);
    const file = form.get("file") as File;
    if (!file || !order) return setUploading(false);

    const supabase = getSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    const path = `${order.customer_id}/${order.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("project-files").upload(path, file);

    if (!error && auth.user) {
      await supabase.from("project_files").insert({
        order_id: order.id,
        uploaded_by: auth.user.id,
        file_name: file.name,
        file_path: path,
        file_type: file.type,
        is_final: form.get("is_final") === "on",
      });
      await supabase.from("order_activities").insert({
        order_id: order.id,
        actor_id: auth.user.id,
        activity_type: "file_uploaded",
        description: `File ${file.name} telah diunggah.`,
      });
      event.currentTarget.reset();
    }
    setUploading(false);
  }

  if (!order) return <div className="page container" style={{ paddingTop: 150 }}>Memuat order…</div>;

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <span className="badge">{statusLabel(order.status)}</span>
          <h1 className="heading">{order.order_code}</h1>
          <p className="text-muted">{order.customer_name} · {order.customer_email} · {order.brand_name}</p>

          <div className="admin-grid">
            <form className="card panel form-grid" onSubmit={updateOrder}>
              <h2>Kelola status</h2>
              <div className="field">
                <label>Status</label>
                <select className="input" name="status" defaultValue={order.status}>
                  {statuses.map((status) => <option value={status} key={status}>{statusLabel(status)}</option>)}
                </select>
              </div>
              <div className="field"><label>Progress (%)</label><input className="input" type="number" min="0" max="100" name="progress" defaultValue={order.progress} /></div>
              <div className="field"><label>Harga disepakati</label><input className="input" type="number" name="agreed_price" defaultValue={order.agreed_price ?? ""} /></div>
              <button className="button button-primary">Simpan Perubahan</button>
            </form>

            <form className="card panel form-grid" onSubmit={uploadFile}>
              <h2>Upload file proyek</h2>
              <div className="field"><label>Pilih file</label><input className="input" type="file" name="file" required /></div>
              <label className="checkbox"><input type="checkbox" name="is_final" /> Tandai sebagai file final</label>
              <button className="button button-primary" disabled={uploading}>{uploading ? "Mengunggah…" : "Upload File"}</button>
            </form>

            <section className="card panel">
              <h2>Tahapan proyek</h2>
              <div className="stack">
                {progress.map((item) => (
                  <button className="stage" onClick={() => toggleStage(item)} key={item.id}>
                    <span>{item.is_completed ? "✓" : "○"}</span>
                    <div><strong>{item.title}</strong><small>{item.description}</small></div>
                  </button>
                ))}
              </div>
            </section>

            <section className="card panel">
              <h2>Permintaan revisi</h2>
              <div className="stack">
                {revisions.length === 0 && <p className="text-muted">Belum ada revisi.</p>}
                {revisions.map((revision) => (
                  <article className="revision" key={revision.id}>
                    <span className="badge">{revision.status}</span>
                    <p>{revision.message}</p>
                    <form className="form-grid" onSubmit={(e) => respondRevision(e, revision)}>
                      <textarea className="input" name="response" defaultValue={revision.admin_response ?? ""} placeholder="Balasan admin…" required />
                      <button className="button button-outline">Simpan Balasan</button>
                    </form>
                  </article>
                ))}
              </div>
            </section>

            <section className="card panel brief">
              <h2>Brief pelanggan</h2>
              <Detail label="Paket" value={order.packages?.name ?? "-"} />
              <Detail label="Bidang" value={order.business_field ?? "-"} />
              <Detail label="Target" value={order.target_market ?? "-"} />
              <Detail label="Gaya" value={order.logo_style ?? "-"} />
              <Detail label="Deadline" value={formatDate(order.deadline)} />
              <Detail label="Pesan" value={order.message} />
            </section>
          </div>
        </div>
      </main>
      <style jsx>{`
        .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 35px; align-items: start; }
        .panel { padding: 27px; }
        h2 { font: 800 1.45rem Manrope; }
        .checkbox { color: var(--muted); display: flex; gap: 10px; }
        .stack { display: grid; gap: 12px; }
        .stage { width: 100%; background: #0d0d0d; color: white; border: 1px solid var(--border); padding: 14px; border-radius: 13px; display: grid; grid-template-columns: 25px 1fr; text-align: left; gap: 10px; }
        .stage span { color: var(--gold); }
        .stage small { display: block; color: var(--muted); margin-top: 4px; }
        .revision { border: 1px solid var(--border); border-radius: 14px; padding: 15px; }
        .brief { grid-column: 1 / -1; }
        @media(max-width:800px) { .admin-grid { grid-template-columns: 1fr; } .brief { grid-column: auto; } }
      `}</style>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <p><strong>{label}:</strong> <span className="text-muted">{value}</span></p>;
}
