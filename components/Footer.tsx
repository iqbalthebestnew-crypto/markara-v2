export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <strong>MARKARA</strong>
          <p>Logo dan branding studio untuk brand yang ingin meninggalkan kesan.</p>
        </div>
        <div>
          <span>© {new Date().getFullYear()} MARKARA</span>
          <span>Indonesia · International</span>
        </div>
      </div>
      <style jsx>{`
        .footer {
          border-top: 1px solid var(--border);
          padding: 45px 0;
          color: var(--muted);
        }
        .footer-grid {
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }
        strong {
          color: white;
          letter-spacing: .12em;
        }
        p {
          max-width: 470px;
        }
        .footer-grid > div:last-child {
          text-align: right;
          display: grid;
          gap: 7px;
        }
        @media(max-width:700px) {
          .footer-grid { flex-direction: column; }
          .footer-grid > div:last-child { text-align: left; }
        }
      `}</style>
    </footer>
  );
}
