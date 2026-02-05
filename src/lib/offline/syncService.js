// =====================================================
// Arguz Tech - Sync automático PROFISSIONAL
// =====================================================

import { listarOrdensPendentes, limparPendenciasOrdens } from './ordensQueue';
import api from '../api';

let sincronizando = false;
let listenerIniciado = false;
let intervalo = null;

/* =====================================================
   SYNC PRINCIPAL
===================================================== */
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
    console.log('Sem internet ou erro no sync');
  } finally {
    sincronizando = false;
  }
}

/* =====================================================
   LISTENER GLOBAL
===================================================== */
export function iniciarSyncListener() {
  // ✅ evita múltiplos listeners
  if (listenerIniciado) return;

  listenerIniciado = true;

  console.log('🔄 Sync listener iniciado');

  // 🔹 roda imediatamente
  sincronizarOrdens();

  // 🔹 roda ao reconectar
  window.addEventListener('online', sincronizarOrdens);

  // 🔹 roda a cada 30s (extra segurança)
  intervalo = setInterval(sincronizarOrdens, 30000);
}
