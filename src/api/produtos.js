import api from '../lib/api';

// Listar produtos
export async function listarProdutos() {
  const { data } = await api.get('/produtos');
  return data;
}

// Criar produto
export async function criarProduto(payload) {
  const { data } = await api.post('/produtos', payload);
  return data;
}

// Atualizar produto (inclui ativar / inativar)
export async function atualizarProduto(id, payload) {
  const { data } = await api.put(`/produtos/${id}`, payload);
  return data;
}
