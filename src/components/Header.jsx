import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css';

export default function Header({ onMenuClick }) {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <header className="app-header">
      <button
        onClick={onMenuClick}
        className="menu-button"
        aria-label="Abrir menu"
      >
        ☰
      </button>

      <div className="header-right">
        <span className="header-username">
          {usuario?.nome}
        </span>

        <button
          onClick={logout}
          className="btn btn-danger header-logout"
        >
          Sair
        </button>
      </div>
    </header>
  );
}