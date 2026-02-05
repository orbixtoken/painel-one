import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarProduto } from '../../api/produtos';

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
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* CABEÇALHO */}
        <h1 style={{ fontSize: 24, marginBottom: 24 }}>
          Novo Produto
        </h1>

        {/* DADOS PRINCIPAIS */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={grid2}>
            <div>
              <label>Nome do Produto</label>
              <input
                style={input}
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome do Produto"
              />
            </div>

            <div>
              <label>Categoria</label>
              <input
                style={input}
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                placeholder="Categoria"
              />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label>Descrição</label>
            <textarea
              style={textarea}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descrição opcional do produto"
            />
          </div>
        </div>

        {/* ESTOQUE E VALORES */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={grid3}>
            <div>
              <label>Quantidade em Estoque</label>
              <input
                type="number"
                min="0"
                style={input}
                value={quantidade}
                onChange={e => setQuantidade(e.target.value)}
              />
            </div>

            <div>
              <label>Valor Pago (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                style={input}
                value={valorPago}
                onChange={e => setValorPago(e.target.value)}
              />
            </div>

            <div>
              <label>Valor Final (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                style={{
                  ...input,
                  fontWeight: 600
                }}
                value={valorFinal}
                onChange={e => setValorFinal(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* AÇÕES */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 10
          }}
        >
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

/* =========================
   ESTILOS
========================= */

const grid2 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 16
};

const grid3 = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: 16
};

const input = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14
};

const textarea = {
  width: '100%',
  minHeight: 80,
  padding: '10px 12px',
  fontSize: 14,
  resize: 'vertical'
};
