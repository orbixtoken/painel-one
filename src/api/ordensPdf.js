import api from '../lib/api';

export function abrirPdfOrdem(id) {
  return api.get(`/ordens/${id}/pdf`, {
    responseType: 'blob'
  }).then(res => {
    const url = window.URL.createObjectURL(res.data);
    window.open(url);
  });
}

export function baixarPdfOrdem(id) {
  return api.get(`/ordens/${id}/pdf/download`, {
    responseType: 'blob'
  }).then(res => {
    const url = window.URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordem-${id}.pdf`;
    a.click();
  });
}
