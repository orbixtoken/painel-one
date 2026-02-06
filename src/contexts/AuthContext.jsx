import { createContext, useEffect, useState } from 'react';
import api from '../lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     BOOT DA SESSÃO
  ===================================================== */
  useEffect(() => {
    try {
      // limpa possíveis resíduos do modo offline antigo
      localStorage.removeItem('clientes_offline');
      localStorage.removeItem('produtos_offline');
      localStorage.removeItem('ordens_pendentes');
      localStorage.removeItem('orcamentos_pendentes');

      const token = localStorage.getItem('token');
      const usuarioSalvo = localStorage.getItem('usuario');

      if (!token || !usuarioSalvo) {
        setLoading(false);
        return;
      }

      const usuarioParse = JSON.parse(usuarioSalvo);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUsuario(usuarioParse);
    } catch (err) {
      // se der erro em qualquer dado salvo, limpa tudo
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
    }

    setLoading(false);
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */
  async function login(email, senha) {
    const { data } = await api.post('/auth/login', {
      email,
      senha
    });

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    api.defaults.headers.Authorization = `Bearer ${data.token}`;
    setUsuario(data.usuario);
  }

  /* =====================================================
     LOGOUT
  ===================================================== */
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    delete api.defaults.headers.Authorization;
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        autenticado: !!usuario,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
