import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await login(email, senha);
      window.location.href = '/';

    } catch {
      setErro('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src="/arguz_logo.png" alt="Arguz Tech" className="login-logo" />

        <h1>Arguz One</h1>
        <p className="subtitle">Sistema de gestão inteligente</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />

          {erro && <p className="erro">{erro}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <footer className="login-footer">
          Produto Arguz Tech • contato@arguztech.com.br
        </footer>
      </div>
    </div>
  );
}
