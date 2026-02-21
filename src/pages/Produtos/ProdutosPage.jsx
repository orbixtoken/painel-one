import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listarProdutos,
  atualizarProduto
} from '../../api/produtos';
import './ProdutosPage.css';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('ativo');
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await listarProdutos();
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      alert('Erro ao carregar produtos do servidor');
    }
  }

  async function toggleAtivo(produto) {
    const acao = produto.ativo ? 'inativar' : 'ativar';
    if (!window.confirm(`Deseja ${acao} este produto?`)) return;

    await atualizarProduto(produto.id, {
      ...produto,
      ativo: !produto.ativo
    });

    carregar();
  }

  const produtosFiltrados = produtos.filter(p => {
    if (filtroStatus === 'ativo') return p.ativo;
    if (filtroStatus === 'inativo') return !p.ativo;
    return true;
  });

  return (
    <div className="page">
      <div className="produtos-container">

        {/* HEADER */}
        <div className="produtos-header">
          <div>
            <h1>Produtos</h1>
            <p>Controle e gerenciamento de produtos</p>
          </div>

          <div className="produtos-header-actions">
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
            >
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="todos">Todos</option>
            </select>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/produtos/novo')}
            >
              + Novo Produto
            </button>
          </div>
        </div>

        {/* TABELA */}
        <div className="card">
          <div className="table-wrapper">
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {produtosFiltrados.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>

                    <td>
                      <strong>{p.nome}</strong>
                    </td>

                    <td>
                      R$ {Number(p.valor_final).toFixed(2)}
                    </td>

                    <td>{p.quantidade}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          p.ativo ? 'ativo' : 'inativo'
                        }`}
                      >
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td>
                      <div className="acoes-cell">
                        <button
                          className="btn"
                          onClick={() =>
                            navigate(`/produtos/${p.id}`)
                          }
                        >
                          Ver
                        </button>

                        <button
                          className={
                            p.ativo ? 'btn btn-danger' : 'btn'
                          }
                          onClick={() => toggleAtivo(p)}
                        >
                          {p.ativo ? 'Inativar' : 'Ativar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {produtosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-cell">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}