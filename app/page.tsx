"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Layers3, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  return (
    <>
      <SplashScreen />
      <Navbar />
      <main className="page">
        <section className="hero">
          <div className="container hero-grid">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .8 }}
            >
              <p className="eyebrow">Logo & Branding Studio</p>
              <h1 className="title">
                Kami membangun brand yang meninggalkan <span className="gold">kesan.</span>
              </h1>
              <p className="lead">
                MARKARA membantu personal brand, UMKM, startup, dan perusahaan tampil lebih kuat melalui logo dan identitas visual yang strategis.
              </p>
              <div className="actions">
                <Link className="button button-primary" href="/pricing">
                  Mulai Proyek <ArrowRight size={18} />
                </Link>
                <a className="button button-outline" href="#services">Lihat layanan</a>
              </div>
              <div className="stats">
                <div><strong>4</strong><span>Paket fleksibel</span></div>
                <div><strong>ID / EN</strong><span>Pasar luas</span></div>
                <div><strong>Realtime</strong><span>Progress proyek</span></div>
              </div>
            </motion.div>

            <motion.div
              className="showcase"
              initial={{ opacity: 0, scale: .92, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: .25, duration: .9 }}
            >
              <div className="orb" />
              <div className="mock-card back">
                <span>M</span><strong>MARKARA</strong><small>BRANDING STUDIO</small>
              </div>
              <div className="mock-card front">
                <span>M</span><strong>MARKARA</strong><small>DESIGN THAT LEAVES A MARK</small>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <p className="eyebrow">Layanan</p>
            <h2 className="heading">Satu identitas yang bekerja di setiap titik kontak.</h2>
            <div className="service-grid">
              {[
                [Sparkles, "Logo Design", "Logo orisinal yang relevan dengan karakter dan arah bisnis Anda."],
                [Layers3, "Brand Identity", "Sistem visual yang membuat brand tampil konsisten dan mudah dikenali."],
                [BadgeCheck, "Brand Guideline", "Panduan profesional untuk menjaga konsistensi penggunaan identitas."],
              ].map(([Icon, title, text], index) => {
                const I = Icon as typeof Sparkles;
                return (
                  <motion.article
                    key={String(title)}
                    className="card card-hover service-card"
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * .12 }}
                  >
                    <I className="gold" />
                    <h3>{String(title)}</h3>
                    <p>{String(text)}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container cta card">
            <div>
              <p className="eyebrow">Siap memulai?</p>
              <h2 className="heading">Pilih paket dan mulai membangun identitas brand Anda.</h2>
            </div>
            <Link className="button button-primary" href="/pricing">
              Lihat Pricelist <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx>{`
        .hero { min-height: 780px; display: grid; align-items: center; padding: 80px 0; }
        .hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 60px; align-items: center; }
        .lead { max-width: 680px; margin: 28px 0 0; color: var(--muted); font-size: 1.1rem; line-height: 1.8; }
        .actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 58px; padding-top: 24px; border-top: 1px solid var(--border); }
        .stats strong, .stats span { display: block; }
        .stats strong { color: var(--gold-light); font-size: 1.05rem; }
        .stats span { color: var(--muted); font-size: .75rem; margin-top: 4px; }
        .showcase { min-height: 480px; position: relative; }
        .orb { position: absolute; inset: 10% 5% auto auto; width: 340px; height: 340px; border-radius: 50%; background: rgba(212,175,55,.14); filter: blur(70px); }
        .mock-card { position: absolute; width: min(360px, 80vw); height: 230px; display: grid; place-content: center; text-align: center; border: 1px solid rgba(212,175,55,.35); background: linear-gradient(145deg,#1b1b1b,#060606); box-shadow: var(--shadow); }
        .mock-card span { font: 800 3rem Manrope; color: var(--gold); }
        .mock-card strong { font: 800 1.5rem Manrope; letter-spacing: .18em; color: var(--gold-light); }
        .mock-card small { color: #777; letter-spacing: .14em; margin-top: 5px; }
        .back { top: 50px; right: 0; transform: rotate(5deg); }
        .front { bottom: 45px; left: 0; transform: rotate(-4deg); }
        .service-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 45px; }
        .service-card { padding: 30px; min-height: 230px; }
        .service-card h3 { font: 700 1.4rem Manrope; margin-top: 45px; }
        .service-card p { color: var(--muted); line-height: 1.75; }
        .cta { padding: 45px; display: flex; align-items: center; justify-content: space-between; gap: 30px; }
        .cta .heading { max-width: 780px; font-size: clamp(2rem, 4vw, 3.3rem); }
        @media(max-width:850px) {
          .hero-grid { grid-template-columns: 1fr; }
          .showcase { min-height: 400px; }
          .service-grid { grid-template-columns: 1fr; }
          .cta { align-items: flex-start; flex-direction: column; }
        }
        @media(max-width:600px) {
          .stats { grid-template-columns: 1fr; }
          .mock-card { width: 260px; height: 170px; }
          .showcase { min-height: 330px; }
        }
      `}</style>
    </>
  );
}
