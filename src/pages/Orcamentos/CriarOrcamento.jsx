import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarOrcamento } from '../../api/orcamentos';
import { listarProdutos } from '../../api/produtos';

// 🔥 OFFLINE
//import { adicionarOrcamentoPendente } from '../../lib/offline/orcamentosQueue';

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

  /* =========================
     SALVAR (ONLINE + OFFLINE)
  ========================= */
  async function salvar() {
    if (itens.length === 0) {
      alert('Adicione ao menos um item');
      return;
    }

    const payload = {
      cliente_id: clienteId ? Number(clienteId) : null,
      itens,
      desconto_tipo: descontoTipo || null,
      desconto_valor: Number(descontoValor) || 0,
      validade: validade || null,
      observacoes: observacoes || null
    };

    try {
      setSalvando(true);

      // 🔵 ONLINE
      await criarOrcamento(payload);

      navigate('/orcamentos');

    } catch {

      // 🔴 OFFLINE
      await adicionarOrcamentoPendente(payload);

      alert(
        '📴 Sem internet.\nO orçamento foi salvo offline e será sincronizado automaticamente.'
      );

      navigate('/orcamentos');
    } finally {
      setSalvando(false);
    }
  }

  /* =========================
     UI ORIGINAL (INALTERADA)
  ========================= */
  return (
    <div className="page">
      <div style={{ maxWidth: 880, margin: '0 auto' }}>

        <h1 style={{ fontSize: 28, marginBottom: 24 }}>
          Novo Orçamento
        </h1>

        <div className="card">
          <label style={label}>ID do Cliente (opcional)</label>
          <input
            style={input}
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
          />
        </div>

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
                value={item.quantidade}
                onChange={e =>
                  atualizarItem(i, 'quantidade', Number(e.target.value))
                }
              />

              <input
                style={input}
                type="number"
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

        <button onClick={adicionarProduto}>+ Produto</button>
        <button onClick={adicionarServico} style={{ marginLeft: 10 }}>
          + Serviço
        </button>

        <div className="card">
          <strong>Total: R$ {total.toFixed(2)}</strong>
        </div>

        <button
          className="btn btn-primary"
          onClick={salvar}
          disabled={salvando}
        >
          {salvando ? 'Salvando...' : 'Salvar Orçamento'}
        </button>

      </div>
    </div>
  );
}

const label = { fontSize: 14, fontWeight: 500, marginBottom: 6 };
const input = { width: '100%', padding: '10px 12px', fontSize: 14, borderRadius: 6 };
