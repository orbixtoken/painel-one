// api/auditoria.js
import api from '../lib/api';

export async function listarAuditoria() {
  const { data } = await api.get('/auditoria');
  return data;
}
