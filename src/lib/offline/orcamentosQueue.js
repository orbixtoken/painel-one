import { getDB } from './db';
import { criarOrcamento } from '../../api/orcamentos';

/* =========================
   ADD FILA
========================= */
export async function adicionarOrcamentoPendente(payload) {
  const db = await getDB();

  await db.add('orcamentos_pendentes', {
    payload,
    criado_em: Date.now()
  });
}

/* =========================
   SYNC
========================= */
export async function sincronizarOrcamentos() {
  const db = await getDB();
  const lista = await db.getAll('orcamentos_pendentes');

  for (const item of lista) {
    try {
      await criarOrcamento(item.payload);
      await db.delete('orcamentos_pendentes', item.id);
    } catch {
      // mantém se falhar
    }
  }
}

/* =========================
   AUTO SYNC
========================= */
window.addEventListener('online', () => {
  sincronizarOrcamentos();
});
