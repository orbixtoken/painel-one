import api from '../lib/api';

// Login
export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

// Logout (se existir backend, senão apenas frontend)
export async function logout() {
  return true;
}

// Buscar usuário logado
export async function me() {
  const { data } = await api.get('/auth/me');
  return data;
}
