import logo from '/arguz_logo.png';

export default function DashboardHome() {
  return (
    <div className="dashboard-hero">
      <img
        src={logo}
        alt="Arguz Tech"
        style={{ width: '140px', marginBottom: '20px' }}
      />

      <h1>
        Arguz <span>One</span>
      </h1>

      <p>Sistema de Gestão Inteligente</p>

      <footer
        style={{
          marginTop: '40px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        Arguz One © 2025 — Arguz Tech · contato@arguztech.com.br
      </footer>
    </div>
  );
}
