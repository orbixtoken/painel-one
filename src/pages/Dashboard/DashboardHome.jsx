import logo from '/arguz_logo.png';
import './DashboardHome.css';

export default function DashboardHome() {
  return (
    <div className="dashboard-hero">
      <img
        src={logo}
        alt="Arguz Tech"
        className="dashboard-logo"
      />

      <h1 className="dashboard-title">
         <span></span>
      </h1>

      <p className="dashboard-subtitle">
        
      </p>

      <footer className="dashboard-footer">
        Arguz One © 2025 — Arguz Tech · contato@arguztech.com.br
      </footer>
    </div>
  );
}