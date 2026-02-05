import api from '../lib/api';

/**
 * ============================
 * LISTAR TODOS OS MOVIMENTOS
 * (com contexto de ordem)
 * ============================
 */
export async function listarMovimentos() {
  const { data } = await api.get('/financeiro');
  return data;
}

/**
 * ============================
 * LISTAR MOVIMENTOS POR ORDEM
 * ============================
 */
export async function listarMovimentosPorOrdem(ordemId) {
  const { data } = await api.get(`/financeiro/ordem/${ordemId}`);
  return data;
}

/**
 * ============================
 * RESUMO FINANCEIRO REAL
 * (entradas válidas, canceladas, estornos)
 * ============================
 */
export async function resumoFinanceiro() {
  const { data } = await api.get('/financeiro/resumo');
  return data;
}
