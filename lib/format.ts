export function formatRupiah(value: number | null | undefined) {
  if (value === null || value === undefined) return "Belum ditentukan";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "Belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(new Date(value));
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    process: "Proses",
    research: "Research",
    concept: "Konsep",
    revision: "Revisi",
    finalization: "Finalisasi",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return labels[status] ?? status;
}
