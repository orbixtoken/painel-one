import { NavLink } from 'react-router-dom';
import './Sidebar.css';
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
    >
      {/* HEADER */}
      <div className="sidebar-header">
        <span>
          MUZEL<span className="brand"></span>
        </span>

        <button
          onClick={onClose}
          className="sidebar-close-btn"
        >
          ✕
        </button>
      </div>

      {/* LINKS */}
      <nav className="sidebar-nav">
        <NavLink to="/" end style={linkStyle} onClick={onClose}>Dashboard</NavLink>
        <NavLink to="/ordens" style={linkStyle} onClick={onClose}>Entradas</NavLink>
        <NavLink to="/clientes" style={linkStyle} onClick={onClose}>Clientes</NavLink>
        <NavLink to="/produtos" style={linkStyle} onClick={onClose}>Produtos</NavLink>
        <NavLink to="/financeiro" style={linkStyle} onClick={onClose}>Financeiro</NavLink>
        <NavLink to="/financeiro-extra" style={linkStyle} onClick={onClose}>Despesas</NavLink>
       <NavLink to="/lancamentos-futuros" style={linkStyle} onClick={onClose}>Lançamentos Futuros</NavLink>
        <NavLink to="/auditoria" style={linkStyle} onClick={onClose}>Auditoria</NavLink>
        <NavLink to="/usuarios" style={linkStyle} onClick={onClose}>Usuários</NavLink>
        <NavLink to="/orcamentos" style={linkStyle} onClick={onClose}>Orçamentos</NavLink>
        <NavLink to="/empresa" style={linkStyle} onClick={onClose}>Configurações</NavLink>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        Arguz Tech © 2025
      </div>
    </aside>
  );
}