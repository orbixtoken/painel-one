import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen = false, onClose }) {
  const linkStyle = ({ isActive }) => ({
    padding: '12px 16px',
    borderRadius: '8px',
    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
    background: isActive ? 'var(--bg-hover)' : 'transparent',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: isActive ? 600 : 500,
    transition: 'background 0.2s ease, color 0.2s ease',
  });

  return (
    <aside
      className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      style={{
        width: '240px',
        background: 'var(--bg-surface-solid)',
        borderRight: '1px solid var(--border-soft)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER LOGO */}
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--border-soft)',
          justifyContent: 'space-between'
        }}
      >
        <span>
          Arguz<span style={{ color: 'var(--brand)' }}>One</span>
        </span>

        {/* BOTÃO FECHAR NO MOBILE */}
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '1.3rem',
            cursor: 'pointer',
            display: 'none'
          }}
          className="sidebar-close-btn"
        >
          ✕
        </button>
      </div>

      {/* LINKS */}
      <nav
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '14px',
        }}
      >
        <NavLink to="/" end style={linkStyle} onClick={onClose}>Dashboard</NavLink>
        <NavLink to="/ordens" style={linkStyle} onClick={onClose}>Ordens</NavLink>
        <NavLink to="/clientes" style={linkStyle} onClick={onClose}>Clientes</NavLink>
        <NavLink to="/produtos" style={linkStyle} onClick={onClose}>Produtos</NavLink>
        <NavLink to="/financeiro" style={linkStyle} onClick={onClose}>Financeiro</NavLink>
        <NavLink to="/auditoria" style={linkStyle} onClick={onClose}>Auditoria</NavLink>
        <NavLink to="/usuarios" style={linkStyle} onClick={onClose}>Usuários</NavLink>
        <NavLink to="/orcamentos" style={linkStyle} onClick={onClose}>Orçamentos</NavLink>
        <NavLink to="/empresa" style={linkStyle} onClick={onClose}>Configurações</NavLink>
      </nav>

      {/* FOOTER */}
      <div
        style={{
          padding: '12px 16px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-soft)',
          textAlign: 'center',
        }}
      >
        Arguz Tech © 2025
      </div>
    </aside>
  );
}
