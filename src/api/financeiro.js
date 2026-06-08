import api from '../lib/api'

/**
 * ============================
 * LISTAR TODOS OS MOVIMENTOS
 * ============================
 */
export async function listarMovimentos() {

  const { data } = await api.get('/financeiro')
  return data

}

/**
 * ============================
 * LISTAR MOVIMENTOS POR ORDEM
 * ============================
 */
export async function listarMovimentosPorOrdem(ordemId) {

  const { data } = await api.get(`/financeiro/ordem/${ordemId}`)
  return data

}

/**
 * ============================
 * RESUMO FINANCEIRO
 * ============================
 */
export async function resumoFinanceiro() {

  const { data } = await api.get('/financeiro/resumo')
  return data

}

/**
 * ============================
 * CRIAR ENTRADA MANUAL
 * ============================
 */
export async function criarEntradaManual(payload) {

  const { data } = await api.post('/financeiro/entrada-manual', payload)
  return data

}

/**
 * ============================
 * REGISTRAR DESPESA DIRETA
 * (caso use no futuro)
 * ============================
 */
export async function criarDespesa(payload) {

  const { data } = await api.post('/financeiro/despesa', payload)
  return data

}

/**
 * ============================
 * RELATÓRIO FINANCEIRO PROFISSIONAL
 * ============================
 */
export async function relatorioFinanceiro(params = {}) {

  const { data } = await api.get('/financeiro/relatorio', {
    params
  })

  return data

}