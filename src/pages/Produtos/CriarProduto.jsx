import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarProduto } from '../../api/produtos';
import './CriarProduto.css';

export default function CriarProduto() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [valorFinal, setValorFinal] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!nome || valorFinal === '') {
      alert('Nome e valor final são obrigatórios');
      return;
    }

    try {
      setSalvando(true);

      await criarProduto({
        nome,
        categoria,
        descricao,
        quantidade: Number(quantidade) || 0,
        valor_pago: Number(valorPago) || 0,
        valor_final: Number(valorFinal),
        data_validade: null,
        alerta_validade_dias: null
      });

      navigate('/produtos');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar produto');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page">
      <div className="criar-produto-container">

        {/* HEADER */}
        <div className="criar-produto-header">
          <h1>Novo Produto</h1>
          <p>Preencha os dados para cadastrar um novo produto</p>
        </div>

        {/* DADOS PRINCIPAIS */}
        <div className="card">
          <div className="grid-2">

            <div className="form-group">
              <label>Nome do Produto *</label>
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do Produto"
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <input
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                placeholder="Categoria"
              />
            </div>

          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descrição opcional do produto"
            />
          </div>
        </div>

        {/* ESTOQUE E VALORES */}
        <div className="card">
          <div className="grid-3">

            <div className="form-group">
              <label>Quantidade em Estoque</label>
              <input
                type="number"
                min="0"
                value={quantidade}
                onChange={e => setQuantidade(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Valor Pago (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorPago}
                onChange={e => setValorPago(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Valor Final (R$) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="valor-final"
                value={valorFinal}
                onChange={e => setValorFinal(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* AÇÕES */}
        <div className="form-actions">
          <button
            className="btn"
            onClick={() => navigate('/produtos')}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            onClick={salvar}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Criar Produto'}
          </button>
        </div>

      </div>
    </div>
  );
}