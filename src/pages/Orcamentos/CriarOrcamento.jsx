import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarOrcamento } from '../../api/orcamentos';
import { listarProdutos } from '../../api/produtos';

export default function CriarOrcamento() {
  const navigate = useNavigate();

  const [clienteId, setClienteId] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);

  const [descontoTipo, setDescontoTipo] = useState('');
  const [descontoValor, setDescontoValor] = useState('');
  const [validade, setValidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarProdutos().then(data =>
      setProdutos(data.filter(p => p.ativo))
    );
  }, []);

  function adicionarProduto() {
    setItens(prev => [
      ...prev,
      { tipo: 'produto', produto_id: '', quantidade: 1, preco_unitario: 0 }
    ]);
  }

  function adicionarServico() {
    setItens(prev => [
      ...prev,
      { tipo: 'servico', servico_descricao: '', quantidade: 1, preco_unitario: 0 }
    ]);
  }

  function atualizarItem(index, campo, valor) {
    const copia = [...itens];
    copia[index][campo] = valor;
    setItens(copia);
  }

  function selecionarProduto(index, produtoId) {
    const produto = produtos.find(p => p.id == produtoId);
    if (!produto) return;

    const copia = [...itens];
    copia[index].produto_id = produto.id;
    copia[index].preco_unitario = produto.valor_final;
    setItens(copia);
  }

  function removerItem(index) {
    setItens(itens.filter((_, i) => i !== index));
  }

  const subtotal = useMemo(() => {
    return itens.reduce(
      (t, i) => t + Number(i.quantidade) * Number(i.preco_unitario),
      0
    );
  }, [itens]);

  const total = useMemo(() => {
    let v = subtotal;
    if (descontoTipo === 'percentual') v -= subtotal * (descontoValor / 100);
    if (descontoTipo === 'valor') v -= descontoValor;
    return v < 0 ? 0 : v;
  }, [subtotal, descontoTipo, descontoValor]);

  async function salvar() {
    if (itens.length === 0) {
      alert('Adicione ao menos um item');
      return;
    }

    try {
      setSalvando(true);
      await criarOrcamento({
        cliente_id: clienteId ? Number(clienteId) : null,
        itens,
        desconto_tipo: descontoTipo || null,
        desconto_valor: Number(descontoValor) || 0,
        validade: validade || null,
        observacoes: observacoes || null
      });
      navigate('/orcamentos');
    } catch {
      alert('Erro ao criar orçamento');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page">
      <div style={{ maxWidth: 880, margin: '0 auto' }}>

        {/* TÍTULO */}
        <h1 style={{ fontSize: 28, marginBottom: 24 }}>
          Novo Orçamento
        </h1>

        {/* CLIENTE */}
        <div className="card">
          <label style={label}>ID do Cliente (opcional)</label>
          <input
            style={input}
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            placeholder="Pode deixar em branco"
          />
        </div>

        {/* ITENS */}
        <h3 style={{ marginTop: 32, marginBottom: 12 }}>
          Itens do Orçamento
        </h3>

        {itens.map((item, i) => (
          <div key={i} className="card">
            <strong style={{ fontSize: 15 }}>
              {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
            </strong>

            {item.tipo === 'produto' ? (
              <select
                style={input}
                value={item.produto_id}
                onChange={e => selecionarProduto(i, e.target.value)}
              >
                <option value="">Selecione o produto</option>
                {produtos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nome} — R$ {Number(p.valor_final).toFixed(2)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                style={input}
                placeholder="Descrição do serviço"
                value={item.servico_descricao}
                onChange={e =>
                  atualizarItem(i, 'servico_descricao', e.target.value)
                }
              />
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 200px',
                gap: 12,
                marginTop: 10
              }}
            >
              <input
                style={input}
                type="number"
                min="1"
                placeholder="Qtd"
                value={item.quantidade}
                onChange={e =>
                  atualizarItem(i, 'quantidade', Number(e.target.value))
                }
              />

              <input
                style={input}
                type="number"
                placeholder="Preço unitário"
                value={item.preco_unitario}
                onChange={e =>
                  atualizarItem(i, 'preco_unitario', Number(e.target.value))
                }
              />
            </div>

            <button
              className="btn btn-danger"
              style={{ marginTop: 12 }}
              onClick={() => removerItem(i)}
            >
              Remover
            </button>
          </div>
        ))}

        <div style={{ marginTop: 12 }}>
          <button onClick={adicionarProduto}>+ Produto</button>
          <button onClick={adicionarServico} style={{ marginLeft: 10 }}>
            + Serviço
          </button>
        </div>

        {/* DESCONTO */}
        <div className="card" style={{ marginTop: 32 }}>
          <label style={label}>Desconto</label>
          <select
            style={input}
            value={descontoTipo}
            onChange={e => setDescontoTipo(e.target.value)}
          >
            <option value="">Sem desconto</option>
            <option value="percentual">Percentual (%)</option>
            <option value="valor">Valor fixo</option>
          </select>

          {descontoTipo && (
            <input
              style={{ ...input, marginTop: 8 }}
              type="number"
              placeholder="Valor do desconto"
              value={descontoValor}
              onChange={e => setDescontoValor(e.target.value)}
            />
          )}
        </div>

        {/* RESUMO */}
        <div
          className="card"
          style={{
            marginTop: 20,
            background: '#0f172a',
            border: '1px solid #1e293b'
          }}
        >
          <p style={{ fontSize: 15 }}>
            Subtotal: <strong>R$ {subtotal.toFixed(2)}</strong>
          </p>
          <p style={{ fontSize: 22, marginTop: 6 }}>
            Total: <strong>R$ {total.toFixed(2)}</strong>
          </p>
        </div>

        {/* VALIDADE / OBS */}
        <div className="card">
          <label style={label}>Validade</label>
          <input
            style={input}
            type="date"
            value={validade}
            onChange={e => setValidade(e.target.value)}
          />

          <label style={{ ...label, marginTop: 14 }}>
            Observações
          </label>
          <textarea
            style={{ ...input, height: 90 }}
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
          />
        </div>

        {/* AÇÕES */}
        <div style={{ marginTop: 28 }}>
          <button onClick={() => navigate('/orcamentos')}>
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            style={{ marginLeft: 10, padding: '10px 22px' }}
            onClick={salvar}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar Orçamento'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   ESTILOS BASE
========================= */
const label = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 6
};

const input = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  borderRadius: 6
};
