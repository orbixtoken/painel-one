import api from '../lib/api';

/**
 * ============================
 * LISTAR USUÁRIOS
 * GET /usuarios
 * (ADMIN)
 * ============================
 */
export async function listarUsuarios() {
  const { data } = await api.get('/usuarios');
  return data;
}

/**
 * ============================
 * CRIAR USUÁRIO
 * POST /usuarios
 * Payload obrigatório:
 * {
 *   nome,
 *   email,
 *   telefone?,
 *   senha,
 *   role
 * }
 * (ADMIN)
 * ============================
 */
export async function criarUsuario(payload) {
  const { data } = await api.post('/usuarios', payload);
  return data;
}

/**
 * ============================
 * ATUALIZAR USUÁRIO
 * PUT /usuarios/:id
 * Pode atualizar:
 * nome, email, telefone, role, ativo
 * (ADMIN)
 * ============================
 */
export async function atualizarUsuario(id, payload) {
  const { data } = await api.put(`/usuarios/${id}`, payload);
  return data;
}
