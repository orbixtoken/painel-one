import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  listarProdutos,
  atualizarProduto
} from '../../api/produtos';

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

  /* =========================
     FILTRO
  ========================= */
  const produtosFiltrados = produtos.filter(p => {
    if (filtroStatus === 'ativo') return p.ativo;
    if (filtroStatus === 'inativo') return !p.ativo;
    return true;
  });

  return (
    <div className="page">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* CABEÇALHO */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600 }}>
              Produtos
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              Controle e gerenciamento de produtos
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
              style={{
                height: 38,
                padding: '0 12px',
                fontSize: 14,
                borderRadius: 6
              }}
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
        <div className="card" style={{ padding: 0 }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Nome</th>
                <th style={th}>Preço</th>
                <th style={th}>Estoque</th>
                <th style={th}>Status</th>
                <th style={th}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map(p => (
                <tr key={p.id}>
                  <td style={td}>{p.id}</td>

                  <td style={td}>
                    <strong>{p.nome}</strong>
                  </td>

                  <td style={td}>
                    R$ {Number(p.valor_final).toFixed(2)}
                  </td>

                  <td style={td}>
                    {p.quantidade}
                  </td>

                  <td style={td}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 14,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#fff',
                        backgroundColor: p.ativo
                          ? '#16a34a'
                          : '#dc2626'
                      }}
                    >
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td style={td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          navigate(`/produtos/${p.id}`)
                        }
                      >
                        Ver
                      </button>

                      <button
                        className={p.ativo ? 'btn-danger' : 'btn'}
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
                  <td
                    colSpan="6"
                    style={{
                      padding: 32,
                      textAlign: 'center',
                      color: '#94a3b8'
                    }}
                  >
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

const th = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: 13,
  fontWeight: 600,
  opacity: 0.8
};

const td = {
  padding: '14px 16px',
  fontSize: 14
};
