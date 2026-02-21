import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await login(email, senha);
      navigate('/');
    } catch {
      setErro('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <img
          src="/arguz_logo.png"
          alt="Arguz Tech"
          className="login-logo"
        />

        <h1>Arguz One</h1>
        <p className="subtitle">
          Sistema de gestão inteligente
        </p>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group senha-group">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
            />

            <button
              type="button"
              className="toggle-senha"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? '🙈' : '👁'}
            </button>
          </div>

          {erro && <p className="erro">{erro}</p>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

        <footer className="login-footer">
          Arguz One © 2025 — Arguz Tech
        </footer>

      </div>
    </div>
  );
}