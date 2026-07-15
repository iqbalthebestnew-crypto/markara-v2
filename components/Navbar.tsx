"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { Profile } from "@/lib/types";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return setProfile(null);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();
      setProfile(profileData as Profile | null);
    }

    load();
    const { data: listener } = supabase.auth.onAuthStateChange(() => load());
    return () => listener.subscription.unsubscribe();
  }, []);

  const dashboardHref = profile?.role === "admin" ? "/admin" : "/customer";

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">M</span>
          <span>MARKARA</span>
        </Link>

        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>Harga</Link>
          {profile ? (
            <Link href={dashboardHref} onClick={() => setOpen(false)}>Dashboard</Link>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
          )}
          <Link href="/pricing" className="button button-primary" onClick={() => setOpen(false)}>
            Pesan Logo
          </Link>
        </nav>
      </div>

      <style jsx>{`
        .nav {
          position: fixed;
          inset: 0 0 auto;
          z-index: 50;
          background: rgba(10,10,10,.82);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,.07);
        }
        .nav-inner {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          font: 800 1rem Manrope, sans-serif;
          letter-spacing: .14em;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid var(--gold);
          color: var(--gold);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 27px;
          color: #d0d0d0;
        }
        .menu-button {
          display: none;
          color: white;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 9px;
        }
        @media (max-width: 760px) {
          .menu-button { display: grid; }
          .nav-links {
            display: none;
            position: absolute;
            left: 18px;
            right: 18px;
            top: 75px;
            padding: 18px;
            border: 1px solid var(--border);
            border-radius: 16px;
            background: #111;
            flex-direction: column;
            align-items: stretch;
          }
          .nav-links.open { display: flex; }
        }
      `}</style>
    </header>
  );
}
