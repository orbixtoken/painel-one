import api from '../lib/api';

/**
 * Gera e retorna o PDF do orçamento
 * Backend deve responder com application/pdf
 */
export async function gerarPdfOrcamento(id) {
  const response = await api.get(`/orcamentos/${id}/pdf`, {
    responseType: 'blob'
  });

  return response.data;
}

/**
 * Abre o PDF em nova aba
 */
export async function abrirPdfOrcamento(id) {
  const blob = await gerarPdfOrcamento(id);
  const url = window.URL.createObjectURL(
    new Blob([blob], { type: 'application/pdf' })
  );
  window.open(url, '_blank');
}

/**
 * Download direto do PDF
 */
export async function baixarPdfOrcamento(id) {
  const blob = await gerarPdfOrcamento(id);
  const url = window.URL.createObjectURL(
    new Blob([blob], { type: 'application/pdf' })
  );

  const a = document.createElement('a');
  a.href = url;
  a.download = `orcamento_${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
