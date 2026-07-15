"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button className="button button-outline" onClick={logout}>
      <LogOut size={17} /> Logout
    </button>
  );
}
