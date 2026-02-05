// api/orcamentos.js


import api from '../lib/api';

// Listar orçamentos
export async function listarOrcamentos() {
  const { data } = await api.get('/orcamentos');
  return data;
}

// Buscar orçamento por ID
export async function buscarOrcamento(id) {
  const { data } = await api.get(`/orcamentos/${id}`);
  return data;
}

// Criar orçamento
export async function criarOrcamento(payload) {
  const { data } = await api.post('/orcamentos', payload);
  return data;
}

// Cancelar orçamento
export async function cancelarOrcamento(id) {
  const { data } = await api.put(`/orcamentos/${id}/cancelar`);
  return data;
}
