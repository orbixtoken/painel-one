import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { buscarOrdem, cancelarOrdem } from '../../api/ordens';
import { listarMovimentosPorOrdem } from '../../api/financeiro';
import {
  abrirPdfOrdem,
  baixarPdfOrdem
} from '../../api/ordensPdf';

import BadgeStatus from '../../components/BadgeStatus';

export default function OrdemDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ordem, setOrdem] = useState(null);
  const [financeiro, setFinanceiro] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line
  }, [id]);

  async function carregarTudo() {
    setLoading(true);
    try {
      const ordemData = await buscarOrdem(id);
      const financeiroData = await listarMovimentosPorOrdem(id);
      setOrdem(ordemData);
      setFinanceiro(financeiroData);
    } catch {
      alert('Erro ao carregar dados da ordem');
    } finally {
      setLoading(false);
    }
  }

  async function cancelar() {
    if (!window.confirm('Deseja cancelar esta ordem?')) return;
    try {
      await cancelarOrdem(id);
      carregarTudo();
    } catch {
      alert('Erro ao cancelar ordem');
    }
  }

  function enviarWhatsapp() {
    if (!ordem) return;

    const mensagem = encodeURIComponent(
      `Olá! Segue a ordem #${ordem.id}.\n` +
      `Total: R$ ${Number(ordem.valor_total).toFixed(2)}`
    );

    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
  }

  async function abrirPdf() {
    try {
      setGerandoPdf(true);
      await abrirPdfOrdem(id);
    } catch {
      alert('Erro ao abrir PDF');
    } finally {
      setGerandoPdf(false);
    }
  }

  async function baixarPdf() {
    try {
      setGerandoPdf(true);
      await baixarPdfOrdem(id);
    } catch {
      alert('Erro ao baixar PDF');
    } finally {
      setGerandoPdf(false);
    }
  }

  if (loading) return <p>Carregando ordem...</p>;
  if (!ordem) return <p>Ordem não encontrada</p>;

  const saldo = financeiro.reduce((total, m) => {
    if (m.tipo === 'entrada') return total + Number(m.valor);
    if (m.tipo === 'estorno') return total - Number(m.valor);
    return total;
  }, 0);

  return (
    <div className="page">
      {/* CABEÇALHO */}
      <div className="page-header">
        <h1>Ordem #{ordem.id}</h1>
        <BadgeStatus status={ordem.status} />
        {ordem.data_abertura && (
          <p>
            Aberta em:{' '}
            {new Date(ordem.data_abertura).toLocaleString()}
          </p>
        )}
      </div>

      <div className="page-content">
        {/* RESUMO */}
        <div className="card" style={{ marginBottom: 24 }}>
          <p>
            <strong>Cliente:</strong> {ordem.cliente_nome}{' '}
            <span style={{ opacity: 0.6 }}>
              (#{ordem.cliente_id})
            </span>
          </p>

          <p>
            <strong>Subtotal:</strong>{' '}
            R$ {Number(ordem.subtotal || 0).toFixed(2)}
          </p>

          {ordem.desconto_valor > 0 && (
            <p style={{ color: '#f87171' }}>
              <strong>Desconto:</strong>{' '}
              {ordem.desconto_tipo === 'percentual'
                ? `${ordem.desconto_valor}%`
                : `R$ ${Number(ordem.desconto_valor).toFixed(2)}`}
            </p>
          )}

          <p style={{ fontSize: 20, marginTop: 8 }}>
            <strong>Total:</strong>{' '}
            R$ {Number(ordem.valor_total).toFixed(2)}
          </p>
        </div>

        {/* ITENS */}
        <h3>Itens da Ordem</h3>

        {ordem.itens.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Valor Unit.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ordem.itens.map(item => (
                <tr key={item.id}>
                  <td>{item.descricao}</td>
                  <td>{item.quantidade}</td>
                  <td>
                    R$ {Number(item.preco_unitario).toFixed(2)}
                  </td>
                  <td>
                    R$ {Number(item.total_item).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Sem itens</p>
        )}

        {/* FINANCEIRO */}
        <h3 style={{ marginTop: 24 }}>Financeiro</h3>

        {financeiro.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {financeiro.map(mov => (
                <tr key={mov.id}>
                  <td>{mov.tipo.toUpperCase()}</td>
                  <td>{mov.descricao}</td>
                  <td
                    className={
                      mov.tipo === 'entrada'
                        ? 'valor-entrada'
                        : 'valor-saida'
                    }
                  >
                    R$ {Number(mov.valor).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Sem movimentações financeiras</p>
        )}

        <p style={{ marginTop: 12 }}>
          <strong>Saldo:</strong> R$ {saldo.toFixed(2)}
        </p>

        {/* AÇÕES */}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap'
          }}
        >
          <button className="btn" onClick={() => navigate('/ordens')}>
            Voltar
          </button>

          {ordem.status !== 'cancelada' && (
            <button className="btn btn-danger" onClick={cancelar}>
              Cancelar Ordem
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={abrirPdf}
            disabled={gerandoPdf}
          >
            Abrir PDF
          </button>

          <button
            className="btn"
            onClick={baixarPdf}
            disabled={gerandoPdf}
          >
            Baixar PDF
          </button>

          <button className="btn" onClick={enviarWhatsapp}>
            Enviar WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
