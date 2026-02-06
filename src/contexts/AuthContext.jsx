import { createContext, useEffect, useState } from 'react';
import api from '../lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (token && usuarioSalvo) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUsuario(JSON.parse(usuarioSalvo));
    }

    setLoading(false);
  }, []);

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
