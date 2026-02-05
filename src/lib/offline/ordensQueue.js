// =====================================================
// Arguz Tech - Fila offline de ORDENS
// Salva ordens criadas sem internet
// =====================================================

import { put, getAll, clear } from './db';

const STORE = 'ordens_pendentes';

// salva ordem local
export async function adicionarOrdemPendente(ordem) {
  await put(STORE, {
    ...ordem,
    criado_em: Date.now()
  });
}

// lista pendentes
export async function listarOrdensPendentes() {
  return await getAll(STORE);
}

// limpa após sincronizar
export async function limparPendenciasOrdens() {
  await clear(STORE);
}
