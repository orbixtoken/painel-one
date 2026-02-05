import api from '../lib/api';

/**
 * Buscar configuração da empresa
 */
export async function buscarEmpresaConfig() {
  const { data } = await api.get('/empresa');
  return data;
}

/**
 * Atualizar configuração da empresa
 */
export async function atualizarEmpresaConfig(payload) {
  const { data } = await api.put('/empresa', payload);
  return data;
}
