import { createContext, useEffect, useState } from 'react';
import api from '../lib/api';

import {
  salvarSessaoOffline,
  obterSessaoOffline,
  limparSessaoOffline
} from '../lib/offline/authOffline';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // BOOT (RESTORE SESSION)
  // =========================
  useEffect(() => {
    const sessao = obterSessaoOffline();

    if (sessao?.token && sessao?.usuario) {
      api.defaults.headers.Authorization = `Bearer ${sessao.token}`;
      setUsuario(sessao.usuario);
    }

    setLoading(false);
  }, []);

  // =========================
  // LOGIN
  // =========================
  async function login(usuarioLogin, senha) {
    try {
      const { data } = await api.post('/auth/login', {
        usuario: usuarioLogin,
        senha
      });

      api.defaults.headers.Authorization = `Bearer ${data.token}`;
      setUsuario(data.usuario);

      salvarSessaoOffline(data.usuario, data.token);

      return true;

    } catch (err) {
      // fallback OFFLINE
      const sessao = obterSessaoOffline();

      if (
        sessao &&
        sessao.usuario &&
        (
          sessao.usuario.email === usuarioLogin ||
          sessao.usuario.nome === usuarioLogin
        )
      ) {
        api.defaults.headers.Authorization = `Bearer ${sessao.token}`;
        setUsuario(sessao.usuario);
        return true;
      }

      throw err;
    }
  }

  // =========================
  // LOGOUT
  // =========================
  function logout() {
    limparSessaoOffline();
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
