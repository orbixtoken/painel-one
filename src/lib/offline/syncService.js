// =====================================================
// Arguz Tech - Sync automático
// Envia pendências quando internet voltar
// =====================================================

import { listarOrdensPendentes, limparPendenciasOrdens } from './ordensQueue';
import api from '../api'; // axios instance
// ajuste caminho se necessário

let sincronizando = false;

export async function sincronizarOrdens() {
  if (sincronizando) return;

  try {
    sincronizando = true;

    const pendentes = await listarOrdensPendentes();

    if (!pendentes.length) return;

    for (const ordem of pendentes) {
      await api.post('/ordens', ordem);
    }

    await limparPendenciasOrdens();

    console.log('✔ Ordens sincronizadas');
  } catch (err) {
    console.log('Sem internet, sync cancelado');
  } finally {
    sincronizando = false;
  }
}

// escuta reconexão
export function iniciarSyncListener() {
  window.addEventListener('online', () => {
    sincronizarOrdens();
  });
}
