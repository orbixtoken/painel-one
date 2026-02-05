// =====================================================
// Cache local de produtos
// =====================================================

import { put, getAll, clear } from './db';

const STORE = 'produtos';

export async function salvarProdutosOffline(produtos) {
  await clear(STORE);

  for (const p of produtos) {
    await put(STORE, p);
  }
}

export async function listarProdutosOffline() {
  return await getAll(STORE);
}
