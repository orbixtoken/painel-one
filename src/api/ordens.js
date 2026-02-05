import api from '../lib/api';

// Listar ordens
export async function listarOrdens() {
  const { data } = await api.get('/ordens');
  return data;
}

// Buscar ordem por ID
export async function buscarOrdem(id) {
  const { data } = await api.get(`/ordens/${id}`);
  return data;
}

// Criar ordem
export async function criarOrdem(payload) {
  const { data } = await api.post('/ordens', payload);
  return data;
}

// Cancelar ordem
export async function cancelarOrdem(id) {
  const { data } = await api.put(`/ordens/${id}/cancelar`);
  return data;
}
