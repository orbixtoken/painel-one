import api from '../lib/api';

/**
 * ============================
 * LISTAR CLIENTES
 * ============================
 */
export async function listarClientes() {
  const { data } = await api.get('/clientes');
  return data;
}

/**
 * ============================
 * BUSCAR CLIENTE POR ID
 * ============================
 */
export async function buscarCliente(id) {
  const { data } = await api.get(`/clientes/${id}`);
  return data;
}

/**
 * ============================
 * CRIAR CLIENTE
 * ============================
 */
export async function criarCliente(payload) {
  const { data } = await api.post('/clientes', payload);
  return data;
}

/**
 * ============================
 * ATUALIZAR CLIENTE
 * (inclui ativar/inativar)
 * ============================
 */
export async function atualizarCliente(id, payload) {
  const { data } = await api.put(`/clientes/${id}`, payload);
  return data;
}

/**
 * ============================
 * HISTÓRICO DO CLIENTE
 * ============================
 */
export async function listarHistoricoCliente(clienteId) {
  const { data } = await api.get(`/clientes/${clienteId}/historico`);
  return data;
}
