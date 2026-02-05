import { useEffect, useState } from 'react';
import { criarOrdem } from '../../api/ordens';
import { buscarCliente } from '../../api/clientes';
import { listarProdutos } from '../../api/produtos';
import { useNavigate } from 'react-router-dom';

// 🔥 NOVO (offline)
import { adicionarOrdemPendente } from '../../lib/offline/ordensQueue';

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

  /* =========================
     LOAD PRODUTOS
  ========================= */
  useEffect(() => {
    listarProdutos().then(setProdutos);
  }, []);

  /* =========================
     CLIENTE
  ========================= */
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

  /* =========================
     ITENS
  ========================= */
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

  /* =========================
     CÁLCULOS
  ========================= */
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

  /* =========================
     SALVAR (ONLINE + OFFLINE)
  ========================= */
  async function salvar() {
    if (!clienteId || itens.length === 0) {
      alert('Informe cliente e ao menos um item');
      return;
    }

    const payload = {
      cliente_id: Number(clienteId),
      itens,
      desconto_tipo: aplicarDesconto ? descontoTipo : null,
      desconto_valor: aplicarDesconto ? descontoValor : 0
    };

    try {
      setSalvando(true);

      // 🔵 tenta online primeiro
      await criarOrdem(payload);

      navigate('/ordens');

    } catch (err) {

      // 🔥 FALLBACK OFFLINE AUTOMÁTICO
      await adicionarOrdemPendente(payload);

      alert(
        '📴 Sem internet.\nA ordem foi salva offline e será sincronizada automaticamente quando a conexão voltar.'
      );

      navigate('/ordens');

    } finally {
      setSalvando(false);
    }
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="page">
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        <h1 style={{ fontSize: 24, marginBottom: 20 }}>Nova Ordem</h1>

        {/* CLIENTE */}
        <div className="card">
          <label style={{ fontSize: 13 }}>Cliente (ID)</label>
          <input
            style={{ height: 44, fontSize: 15, width: 260 }}
            value={clienteId}
            onChange={e => buscarClienteDigitado(e.target.value)}
          />
          {clienteNome && (
            <p style={{ marginTop: 8, fontSize: 14 }}>
              <strong>Cliente:</strong> {clienteNome}
            </p>
          )}
        </div>

        {/* ITENS */}
        <h2 style={{ fontSize: 18, margin: '24px 0 12px' }}>
          Itens da Ordem
        </h2>

        {itens.map((item, index) => {
          const produto = produtos.find(p => p.id == item.referencia_id);

          return (
            <div key={index} className="card">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1fr auto',
                  gap: 16,
                  alignItems: 'end'
                }}
              >

                {item.tipo === 'produto' ? (
                  <div>
                    <label style={{ fontSize: 13 }}>Produto (ID)</label>
                    <input
                      style={{ height: 42, fontSize: 15 }}
                      value={item.referencia_id}
                      onChange={e =>
                        atualizarItem(index, 'referencia_id', e.target.value)
                      }
                    />
                    {produto && (
                      <small style={{ fontSize: 12 }}>
                        {produto.nome} — Estoque {produto.quantidade}
                      </small>
                    )}
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: 13 }}>Serviço</label>
                    <input
                      style={{ height: 42, fontSize: 15 }}
                      value={item.descricao}
                      onChange={e =>
                        atualizarItem(index, 'descricao', e.target.value)
                      }
                    />
                  </div>
                )}

                {item.tipo === 'produto' ? (
                  <input
                    type="number"
                    min="1"
                    style={{ height: 42 }}
                    value={item.quantidade}
                    onChange={e =>
                      atualizarItem(index, 'quantidade', Number(e.target.value))
                    }
                  />
                ) : (
                  <input
                    type="number"
                    style={{ height: 42 }}
                    value={item.valor}
                    onChange={e =>
                      atualizarItem(index, 'valor', Number(e.target.value))
                    }
                  />
                )}

                <button
                  className="btn btn-danger"
                  style={{ height: 42 }}
                  onClick={() => removerItem(index)}
                >
                  Remover
                </button>
              </div>
            </div>
          );
        })}

        <div style={{ marginBottom: 20 }}>
          <button onClick={adicionarProduto}>+ Produto</button>
          <button onClick={adicionarServico} style={{ marginLeft: 10 }}>
            + Serviço
          </button>
        </div>

        {/* RESUMO */}
        <div className="card">
          <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>
          <p style={{ fontSize: 26 }}>
            <strong>Total:</strong> R$ {totalFinal.toFixed(2)}
          </p>
        </div>

        {/* AÇÕES */}
        <div style={{ marginTop: 24 }}>
          <button onClick={() => navigate('/ordens')}>Cancelar</button>
          <button
            className="btn btn-primary"
            style={{ marginLeft: 10 }}
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
