/* =====================================================
   LOGIN OFFLINE ARGuz TECH
===================================================== */

const KEY = 'arguz_offline_user';

/* =========================
   SALVAR SESSÃO
========================= */
export function salvarSessaoOffline(usuario, token) {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      usuario,
      token,
      salvo_em: Date.now()
    })
  );
}

/* =========================
   LER SESSÃO
========================= */
export function obterSessaoOffline() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* =========================
   LIMPAR
========================= */
export function limparSessaoOffline() {
  localStorage.removeItem(KEY);
}
