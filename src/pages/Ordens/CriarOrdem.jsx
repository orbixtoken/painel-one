import { useEffect, useState } from 'react';
import { criarOrdem } from '../../api/ordens';
import { buscarCliente } from '../../api/clientes';
import { listarProdutos } from '../../api/produtos';
import { useNavigate } from 'react-router-dom';
import './CriarOrdem.css';

export default function CriarOrdem() {
  const navigate = useNavigate();

  const [clienteId, setClienteId] = useState('');
  const [clienteNome, setClienteNome] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);
  const [aplicarDesconto, setAplicarDesconto] = useState(false);
  const [descontoTipo, setDescontoTipo] = useState('valor');
  const [descontoValor, setDescontoValor] = useState(0);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarProdutos().then(setProdutos);
  }, []);

  async function buscarClienteDigitado(id) {
    setClienteId(id);
    setClienteNome(null);
    if (!id) return;

    try {
      const cliente = await buscarCliente(id);
      setClienteNome(cliente.nome);
    } catch {
      setClienteNome('Cliente não encontrado');
    }
  }

  function adicionarProduto() {
    setItens([...itens, { tipo: 'produto', referencia_id: '', quantidade: 1 }]);
  }

  function adicionarServico() {
    setItens([...itens, { tipo: 'servico', descricao: '', valor: 0 }]);
  }

  function atualizarItem(index, campo, valor) {
    const copia = [...itens];
    copia[index][campo] = valor;
    setItens(copia);
  }

  function removerItem(index) {
    const copia = [...itens];
    copia.splice(index, 1);
    setItens(copia);
  }

  const subtotal = itens.reduce((total, item) => {
    if (item.tipo === 'produto') {
      const p = produtos.find(p => p.id == item.referencia_id);
      return p ? total + p.valor_final * item.quantidade : total;
    }
    if (item.tipo === 'servico') return total + Number(item.valor || 0);
    return total;
  }, 0);

  const valorDesconto = aplicarDesconto
    ? descontoTipo === 'percentual'
      ? subtotal * (descontoValor / 100)
      : descontoValor
    : 0;

  const totalFinal = Math.max(subtotal - valorDesconto, 0);

  async function salvar() {
    if (!clienteId || itens.length === 0) {
      alert('Informe cliente e ao menos um item');
      return;
    }

    try {
      setSalvando(true);
      await criarOrdem({
        cliente_id: Number(clienteId),
        itens,
        desconto_tipo: aplicarDesconto ? descontoTipo : null,
        desconto_valor: aplicarDesconto ? descontoValor : 0
      });
      navigate('/ordens');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao criar ordem');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page">
      <div className="form-container">

        <h1 className="form-title">Nova Ordem</h1>

        {/* CLIENTE */}
        <div className="card">
          <label>Cliente (ID)</label>
          <input
            className="input-full"
            value={clienteId}
            onChange={e => buscarClienteDigitado(e.target.value)}
          />
          {clienteNome && (
            <p className="cliente-info">
              <strong>Cliente:</strong> {clienteNome}
            </p>
          )}
        </div>

        <h2 className="section-title">Itens da Ordem</h2>

        {itens.map((item, index) => {
          const produto = produtos.find(p => p.id == item.referencia_id);

          return (
            <div key={index} className="card">
              <div className="item-grid">

                <div>
                  <label>
                    {item.tipo === 'produto' ? 'Produto (ID)' : 'Serviço'}
                  </label>
                  <input
                    className="input-full"
                    value={
                      item.tipo === 'produto'
                        ? item.referencia_id
                        : item.descricao
                    }
                    onChange={e =>
                      atualizarItem(
                        index,
                        item.tipo === 'produto'
                          ? 'referencia_id'
                          : 'descricao',
                        e.target.value
                      )
                    }
                  />
                  {produto && (
                    <small>
                      {produto.nome} — Estoque {produto.quantidade}
                    </small>
                  )}
                </div>

                <div>
                  <label>
                    {item.tipo === 'produto' ? 'Qtd' : 'Valor'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input-full"
                    value={
                      item.tipo === 'produto'
                        ? item.quantidade
                        : item.valor
                    }
                    onChange={e =>
                      atualizarItem(
                        index,
                        item.tipo === 'produto'
                          ? 'quantidade'
                          : 'valor',
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                <button
                  className="btn btn-danger item-remove"
                  onClick={() => removerItem(index)}
                >
                  Remover
                </button>

              </div>
            </div>
          );
        })}

        <div className="item-actions">
          <button onClick={adicionarProduto}>+ Produto</button>
          <button onClick={adicionarServico}>+ Serviço</button>
        </div>

        {/* DESCONTO */}
        <div className="card">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={aplicarDesconto}
              onChange={e => setAplicarDesconto(e.target.checked)}
            />
            Aplicar desconto
          </label>

          {aplicarDesconto && (
            <div className="desconto-row">
              <select
                value={descontoTipo}
                onChange={e => setDescontoTipo(e.target.value)}
              >
                <option value="valor">Valor</option>
                <option value="percentual">Percentual</option>
              </select>

              <input
                type="number"
                value={descontoValor}
                onChange={e => setDescontoValor(Number(e.target.value))}
              />
            </div>
          )}
        </div>

        {/* RESUMO */}
        <div className="card resumo">
          <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>
          {aplicarDesconto && (
            <p className="desconto">
              <strong>Desconto:</strong> - R$ {valorDesconto.toFixed(2)}
            </p>
          )}
          <p className="total">
            <strong>Total:</strong> R$ {totalFinal.toFixed(2)}
          </p>
        </div>

        {/* AÇÕES */}
        <div className="form-actions">
          <button onClick={() => navigate('/ordens')}>
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            disabled={salvando}
            onClick={salvar}
          >
            {salvando ? 'Salvando...' : 'Salvar Ordem'}
          </button>
        </div>

      </div>
    </div>
  );
}