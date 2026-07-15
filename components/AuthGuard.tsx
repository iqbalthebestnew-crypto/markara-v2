"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Profile, UserRole } from "@/lib/types";

export default function AuthGuard({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: UserRole;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }

      if (role) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if ((profile as Profile).role !== role) {
          router.replace((profile as Profile).role === "admin" ? "/admin" : "/customer");
          return;
        }
      }

      setReady(true);
    }

    check();
  }, [role, router]);

  if (!ready) {
    return <div className="page container" style={{ paddingTop: 150 }}>Memuat akun…</div>;
  }

  return <>{children}</>;
}
