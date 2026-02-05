// =====================================================
// Cache local de clientes
// =====================================================

import { put, getAll, clear } from './db';

const STORE = 'clientes';

export async function salvarClientesOffline(clientes) {
  await clear(STORE);

  for (const c of clientes) {
    await put(STORE, c);
  }
}

export async function listarClientesOffline() {
  return await getAll(STORE);
}
