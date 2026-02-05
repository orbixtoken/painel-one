import { createContext, useEffect, useState } from 'react';
import api from '../lib/api';

import {
  salvarSessaoOffline,
  obterSessaoOffline,
  limparSessaoOffline
} from '../lib/offline/authOffline';

// ✅ IMPORTANTE — sync só depois do login
import { iniciarSyncListener } from '../lib/offline/syncService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     BOOT (restaurar sessão ao abrir app)
  ===================================================== */
  useEffect(() => {
    const sessao = obterSessaoOffline();

    if (sessao) {
      api.defaults.headers.Authorization = `Bearer ${sessao.token}`;
      setUsuario(sessao.usuario);

      // ✅ usuário já logado → pode iniciar sync
      iniciarSyncListener();
    }

    setLoading(false);
  }, []);

  /* =====================================================
     LOGIN (ONLINE + OFFLINE)
  ===================================================== */
  async function login(usuarioLogin, senha) {
    try {
      // 🔵 ONLINE
      const { data } = await api.post('/auth/login', {
        usuario: usuarioLogin,
        senha
      });

      api.defaults.headers.Authorization = `Bearer ${data.token}`;
      setUsuario(data.usuario);

      salvarSessaoOffline(data.usuario, data.token);

      // ✅ AGORA SIM → iniciar sync
      iniciarSyncListener();

      return true;

    } catch (error) {

      // 🔴 OFFLINE
      const sessao = obterSessaoOffline();

      if (sessao && sessao.usuario.usuario === usuarioLogin) {
        setUsuario(sessao.usuario);
        api.defaults.headers.Authorization = `Bearer ${sessao.token}`;

        // ✅ offline também pode sincronizar depois
        iniciarSyncListener();

        return true;
      }

      throw new Error('Sem internet e usuário não autenticado anteriormente');
    }
  }

  /* =====================================================
     LOGOUT
  ===================================================== */
  function logout() {
    limparSessaoOffline();
    setUsuario(null);

    delete api.defaults.headers.Authorization;

    // opcional: recarregar app limpo
    window.location.href = '/login';
  }

  /* =====================================================
     PROVIDER
  ===================================================== */
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
