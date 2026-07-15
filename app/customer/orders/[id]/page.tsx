"use client";

import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Circle, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { formatDate, statusLabel } from "@/lib/format";
import type { Activity, Order, ProgressItem, ProjectFile, Revision } from "@/lib/types";

export default function CustomerOrderDetailPage() {
  return (
    <AuthGuard role="customer">
      <Detail />
    </AuthGuard>
  );
}

function Detail() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const supabase = getSupabaseBrowserClient();
    const [orderRes, progressRes, revisionsRes, filesRes, activitiesRes] = await Promise.all([
      supabase.from("orders").select("*, packages(*)").eq("id", params.id).single(),
      supabase.from("order_progress").select("*").eq("order_id", params.id).order("sort_order"),
      supabase.from("revisions").select("*").eq("order_id", params.id).order("created_at", { ascending: false }),
      supabase.from("project_files").select("*").eq("order_id", params.id).order("created_at", { ascending: false }),
      supabase.from("order_activities").select("*").eq("order_id", params.id).order("created_at", { ascending: false }),
    ]);
    setOrder(orderRes.data as unknown as Order);
    setProgress((progressRes.data ?? []) as ProgressItem[]);
    setRevisions((revisionsRes.data ?? []) as Revision[]);
    setFiles((filesRes.data ?? []) as ProjectFile[]);
    setActivities((activitiesRes.data ?? []) as Activity[]);
  }

  useEffect(() => { load(); }, [params.id]);

  async function addRevision(event: FormEvent) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user || !message.trim()) return;
    await supabase.from("revisions").insert({
      order_id: params.id,
      customer_id: data.user.id,
      message,
    });
    setMessage("");
    load();
  }

  async function download(file: ProjectFile) {
    const { data, error } = await getSupabaseBrowserClient()
      .storage.from("project-files")
      .createSignedUrl(file.file_path, 60);
    if (!error && data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  if (!order) return <div className="page container" style={{ paddingTop: 150 }}>Memuat proyek…</div>;

  return (
    <>
      <Navbar />
      <main className="page section">
        <div className="container">
          <div className="project-head">
            <div>
              <span className="badge">{statusLabel(order.status)}</span>
              <h1 className="heading">{order.order_code}</h1>
              <p className="text-muted">{order.brand_name} · {order.packages?.name}</p>
            </div>
            <strong>{order.progress}%</strong>
          </div>
          <div className="progress"><span style={{ width: `${order.progress}%` }} /></div>

          <div className="detail-grid">
            <section className="card panel">
              <h2>Timeline proyek</h2>
              <div className="timeline">
                {progress.map((item) => (
                  <div className="timeline-item" key={item.id}>
                    {item.is_completed ? <CheckCircle2 className="gold" /> : <Circle color="#555" />}
                    <div><strong>{item.title}</strong><p>{item.description}</p></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card panel">
              <h2>Kirim revisi</h2>
              <form className="form-grid" onSubmit={addRevision}>
                <textarea className="input" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Jelaskan revisi yang dibutuhkan…" required />
                <button className="button button-primary">Kirim Revisi</button>
              </form>
              <div className="stack">
                {revisions.map((revision) => (
                  <article className="subcard" key={revision.id}>
                    <span className="badge">{revision.status}</span>
                    <p>{revision.message}</p>
                    {revision.admin_response && <p className="admin-reply"><strong>Admin:</strong> {revision.admin_response}</p>}
                  </article>
                ))}
              </div>
            </section>

            <section className="card panel">
              <h2>File proyek</h2>
              {files.length === 0 ? <p className="text-muted">Belum ada file yang diunggah.</p> : (
                <div className="stack">
                  {files.map((file) => (
                    <button className="file-row" key={file.id} onClick={() => download(file)}>
                      <span>{file.file_name}</span><Download size={18} />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="card panel">
              <h2>Aktivitas</h2>
              <div className="stack">
                {activities.map((activity) => (
                  <div className="subcard" key={activity.id}>
                    <strong>{activity.description}</strong>
                    <small>{formatDate(activity.created_at)}</small>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <style jsx>{`
        .project-head { display: flex; justify-content: space-between; gap: 30px; align-items: end; margin-bottom: 20px; }
        .project-head > strong { font: 800 3rem Manrope; color: var(--gold-light); }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 35px; }
        .panel { padding: 27px; }
        h2 { font: 800 1.45rem Manrope; }
        .timeline { display: grid; gap: 22px; margin-top: 25px; }
        .timeline-item { display: grid; grid-template-columns: 25px 1fr; gap: 13px; }
        .timeline-item p { color: var(--muted); margin: 5px 0 0; }
        .stack { display: grid; gap: 12px; margin-top: 20px; }
        .subcard { border: 1px solid var(--border); padding: 15px; border-radius: 14px; }
        .subcard small { color: var(--muted); display: block; margin-top: 7px; }
        .admin-reply { color: #d8d8d8; border-top: 1px solid var(--border); padding-top: 12px; }
        .file-row { width: 100%; background: #0d0d0d; color: white; border: 1px solid var(--border); border-radius: 13px; padding: 14px; display: flex; justify-content: space-between; }
        @media(max-width:800px) { .detail-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
