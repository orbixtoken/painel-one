import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarOrcamento } from '../../api/orcamentos';
import { listarProdutos } from '../../api/produtos';
import './CriarOrcamento.css';

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
    if (descontoTipo === 'percentual')
      v -= subtotal * (descontoValor / 100);
    if (descontoTipo === 'valor')
      v -= descontoValor;
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
      <div className="criar-orcamento-container">

        <h1>Novo Orçamento</h1>

        {/* CLIENTE */}
        <div className="card">
          <div className="form-group">
            <label>ID do Cliente (opcional)</label>
            <input
              value={clienteId}
              onChange={e => setClienteId(e.target.value)}
              placeholder="Pode deixar em branco"
            />
          </div>
        </div>

        {/* ITENS */}
        <h3 className="section-title">Itens do Orçamento</h3>

        {itens.map((item, i) => (
          <div key={i} className="card item-card">

            <strong>
              {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
            </strong>

            {item.tipo === 'produto' ? (
              <select
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
                placeholder="Descrição do serviço"
                value={item.servico_descricao}
                onChange={e =>
                  atualizarItem(i, 'servico_descricao', e.target.value)
                }
              />
            )}

            <div className="item-grid">
              <input
                type="number"
                min="1"
                placeholder="Qtd"
                value={item.quantidade}
                onChange={e =>
                  atualizarItem(i, 'quantidade', Number(e.target.value))
                }
              />

              <input
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
              onClick={() => removerItem(i)}
            >
              Remover
            </button>
          </div>
        ))}

        <div className="item-actions">
          <button onClick={adicionarProduto}>+ Produto</button>
          <button onClick={adicionarServico}>+ Serviço</button>
        </div>

        {/* DESCONTO */}
        <div className="card">
          <div className="form-group">
            <label>Desconto</label>
            <select
              value={descontoTipo}
              onChange={e => setDescontoTipo(e.target.value)}
            >
              <option value="">Sem desconto</option>
              <option value="percentual">Percentual (%)</option>
              <option value="valor">Valor fixo</option>
            </select>

            {descontoTipo && (
              <input
                type="number"
                placeholder="Valor do desconto"
                value={descontoValor}
                onChange={e => setDescontoValor(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* RESUMO */}
        <div className="card resumo-card">
          <p>
            Subtotal: <strong>R$ {subtotal.toFixed(2)}</strong>
          </p>
          <p className="total-final">
            Total: <strong>R$ {total.toFixed(2)}</strong>
          </p>
        </div>

        {/* VALIDADE */}
        <div className="card">
          <div className="form-group">
            <label>Validade</label>
            <input
              type="date"
              value={validade}
              onChange={e => setValidade(e.target.value)}
            />

            <label>Observações</label>
            <textarea
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
            />
          </div>
        </div>

        {/* AÇÕES */}
        <div className="form-actions">
          <button onClick={() => navigate('/orcamentos')}>
            Cancelar
          </button>

          <button
            className="btn btn-primary"
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