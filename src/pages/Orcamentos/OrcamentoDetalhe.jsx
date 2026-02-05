import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buscarOrcamento, cancelarOrcamento } from '../../api/orcamentos';
import {
  abrirPdfOrcamento,
  baixarPdfOrcamento
} from '../../api/orcamentosPdf';
import BadgeStatus from '../../components/BadgeStatus';

export default function OrcamentoDetalhe() {
  const { id } = useParams();
  const [orcamento, setOrcamento] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  useEffect(() => {
    carregar();
  }, [id]);

  async function carregar() {
    const data = await buscarOrcamento(id);
    setOrcamento(data);
  }

  async function cancelar() {
    if (!window.confirm('Cancelar este orçamento?')) return;
    await cancelarOrcamento(id);
    carregar();
  }

  async function abrirPdf() {
    try {
      setGerandoPdf(true);
      await abrirPdfOrcamento(id);
    } finally {
      setGerandoPdf(false);
    }
  }

  async function baixarPdf() {
    try {
      setGerandoPdf(true);
      await baixarPdfOrcamento(id);
    } finally {
      setGerandoPdf(false);
    }
  }

  function enviarWhatsapp() {
    const mensagem = encodeURIComponent(
      `Olá! Segue o orçamento #${orcamento.id}. ` +
      `Valor total: R$ ${Number(orcamento.valor_total).toFixed(2)}.`
    );
    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
  }

  if (!orcamento) return <p>Carregando orçamento...</p>;

  return (
    <div className="page">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* CABEÇALHO */}
        <div className="page-header">
          <div>
            <h1 style={{ fontSize: 26 }}>
              Orçamento #{orcamento.id}
            </h1>
            <BadgeStatus status={orcamento.status} />
            <p style={{ color: '#94a3b8', marginTop: 6 }}>
              Criado em:{' '}
              {new Date(orcamento.criado_em).toLocaleString()}
            </p>
          </div>
        </div>

        {/* CLIENTE */}
        <div className="card">
          <strong>Cliente:</strong>{' '}
          {orcamento.cliente_nome || 'Não informado'}
        </div>

        {/* ITENS */}
        <h3 style={{ marginTop: 24 }}>Itens do Orçamento</h3>

        <div className="card" style={{ padding: 0 }}>
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
              {orcamento.itens.map(item => (
                <tr key={item.id}>
                  <td>
                    <strong>
                      {item.tipo === 'produto'
                        ? item.produto_nome
                        : item.servico_descricao}
                    </strong>
                  </td>
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
        </div>

        {/* RESUMO */}
        <div className="card" style={{ marginTop: 20 }}>
          <p>
            Subtotal:{' '}
            <strong>
              R$ {Number(orcamento.subtotal).toFixed(2)}
            </strong>
          </p>

          {orcamento.desconto_tipo && (
            <p>
              Desconto:{' '}
              {orcamento.desconto_tipo === 'percentual'
                ? `${orcamento.desconto_valor}%`
                : `R$ ${Number(orcamento.desconto_valor).toFixed(2)}`}
            </p>
          )}

          <p style={{ fontSize: 18 }}>
            Total:{' '}
            <strong>
              R$ {Number(orcamento.valor_total).toFixed(2)}
            </strong>
          </p>
        </div>

        {/* OBSERVAÇÕES */}
        {orcamento.observacoes && (
          <div className="card">
            <strong>Observações</strong>
            <p>{orcamento.observacoes}</p>
          </div>
        )}

        {/* AÇÕES */}
        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          {orcamento.status !== 'cancelado' && (
            <button
              className="btn btn-danger"
              onClick={cancelar}
            >
              Cancelar
            </button>
          )}

          <button onClick={abrirPdf} disabled={gerandoPdf}>
            Abrir PDF
          </button>

          <button onClick={baixarPdf} disabled={gerandoPdf}>
            Baixar PDF
          </button>

          <button onClick={enviarWhatsapp}>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
