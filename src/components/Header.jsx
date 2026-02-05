import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Header({ onMenuClick }) {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <header
      style={{
        height: '56px',
        background: 'var(--bg-surface-solid)',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      <button
        onClick={onMenuClick}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '1.3rem',
          cursor: 'pointer',
        }}
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          {usuario?.nome}
        </span>

        <button
          onClick={logout}
          className="btn btn-danger"
          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}
