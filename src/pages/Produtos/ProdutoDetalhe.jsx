import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  listarProdutos,
  atualizarProduto
} from '../../api/produtos';

import BadgeStatus from '../../components/BadgeStatus';
import './ProdutoDetalhe.css';

export default function ProdutoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregar();
    // eslint-disable-next-line
  }, [id]);

  async function carregar() {
    try {
      const produtos = await listarProdutos();
      const encontrado = produtos.find(
        p => String(p.id) === String(id)
      );

      if (!encontrado) {
        alert('Produto não encontrado');
        navigate('/produtos');
        return;
      }

      setProduto(encontrado);
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    try {
      setSalvando(true);

      await atualizarProduto(produto.id, {
        nome: produto.nome,
        descricao: produto.descricao,
        categoria: produto.categoria,
        quantidade: Number(produto.quantidade) || 0,
        valor_pago: Number(produto.valor_pago) || 0,
        valor_final: Number(produto.valor_final),
        data_validade: produto.data_validade,
        alerta_validade_dias: produto.alerta_validade_dias,
        ativo: produto.ativo
      });

      navigate('/produtos');
    } catch {
      alert('Erro ao salvar produto');
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <p>Carregando produto...</p>;
  if (!produto) return null;

  return (
    <div className="page">
      <div className="produto-detalhe-container">

        {/* HEADER */}
        <div className="produto-header">
          <h1>Produto #{produto.id}</h1>
          <BadgeStatus status={produto.ativo ? 'ativo' : 'inativo'} />
        </div>

        {/* DADOS PRINCIPAIS */}
        <div className="card">
          <div className="grid-2">

            <div className="form-group">
              <label>Nome</label>
              <input
                value={produto.nome || ''}
                onChange={e =>
                  setProduto({ ...produto, nome: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <input
                value={produto.categoria || ''}
                onChange={e =>
                  setProduto({ ...produto, categoria: e.target.value })
                }
              />
            </div>

          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={produto.descricao || ''}
              onChange={e =>
                setProduto({ ...produto, descricao: e.target.value })
              }
            />
          </div>
        </div>

        {/* ESTOQUE E VALORES */}
        <div className="card">
          <div className="grid-3">

            <div className="form-group">
              <label>Estoque</label>
              <input
                type="number"
                min="0"
                value={produto.quantidade || 0}
                onChange={e =>
                  setProduto({
                    ...produto,
                    quantidade: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Valor Pago (R$)</label>
              <input
                type="number"
                step="0.01"
                value={produto.valor_pago || 0}
                onChange={e =>
                  setProduto({
                    ...produto,
                    valor_pago: e.target.value
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Valor Final (R$)</label>
              <input
                type="number"
                step="0.01"
                className="valor-final"
                value={produto.valor_final || 0}
                onChange={e =>
                  setProduto({
                    ...produto,
                    valor_final: e.target.value
                  })
                }
              />
            </div>

          </div>
        </div>

        {/* STATUS */}
        <div className="card">
          <div className="form-group">
            <label>Status do Produto</label>
            <select
              value={produto.ativo ? 'true' : 'false'}
              onChange={e =>
                setProduto({
                  ...produto,
                  ativo: e.target.value === 'true'
                })
              }
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        </div>

        {/* AÇÕES */}
        <div className="form-actions">
          <button
            className="btn"
            onClick={() => navigate('/produtos')}
          >
            Voltar
          </button>

          <button
            className="btn btn-primary"
            onClick={salvar}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>

      </div>
    </div>
  );
}