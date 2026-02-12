import api from '../lib/api';

/* =========================
   LISTAR MOVIMENTAÇÕES
========================= */
export async function listarMovimentacoes() {
  const { data } = await api.get('/financeiro-extra');
  return data;
}

/* =========================
   CRIAR MOVIMENTAÇÃO
========================= */
export async function criarMovimentacao(payload) {
  const { data } = await api.post('/financeiro-extra', payload);
  return data;
}
