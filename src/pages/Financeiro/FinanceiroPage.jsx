import { useEffect, useState, useMemo } from 'react';
import { listarMovimentos } from '../../api/financeiro';
import BadgeStatus from '../../components/BadgeStatus';

export default function FinanceiroPage() {
  const [ordensFinanceiras, setOrdensFinanceiras] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('aberta');
  const [filtroPeriodo, setFiltroPeriodo] = useState('semana'); // semana | mes | tudo

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const movimentos = await listarMovimentos();

    const agrupado = {};

    for (const m of movimentos) {
      if (!agrupado[m.ordem_id]) {
        agrupado[m.ordem_id] = {
          ordem_id: m.ordem_id,
          ordem_status: m.ordem_status,
          tipo_composicao: m.tipo_composicao,
          data: m.criado_em, // ✅ CAMPO CORRETO
          entrada: 0,
          estorno: 0,
        };
      }

      // garante a data mais antiga da ordem
      if (new Date(m.criado_em) < new Date(agrupado[m.ordem_id].data)) {
        agrupado[m.ordem_id].data = m.criado_em;
      }

      if (m.tipo === 'entrada') {
        agrupado[m.ordem_id].entrada += Number(m.valor);
      }

      if (m.tipo === 'estorno') {
        agrupado[m.ordem_id].estorno += Number(m.valor);
      }
    }

    setOrdensFinanceiras(Object.values(agrupado));
  }

  // 🔹 filtro por período (AGORA FUNCIONA)
  function filtrarPorPeriodo(ordem) {
    if (filtroPeriodo === 'tudo') return true;

    const hoje = new Date();
    const dataOrdem = new Date(ordem.data);

    if (filtroPeriodo === 'semana') {
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(hoje.getDate() - 7);
      return dataOrdem >= seteDiasAtras;
    }

    if (filtroPeriodo === 'mes') {
      return (
        dataOrdem.getMonth() === hoje.getMonth() &&
        dataOrdem.getFullYear() === hoje.getFullYear()
      );
    }

    return true;
  }

  const ordensFiltradas = useMemo(() => {
    return ordensFinanceiras.filter((o) => {
      const statusOk =
        filtroStatus === 'todas' || o.ordem_status === filtroStatus;
      const periodoOk = filtrarPorPeriodo(o);
      return statusOk && periodoOk;
    });
  }, [ordensFinanceiras, filtroStatus, filtroPeriodo]);

  const totalAbertas = useMemo(() => {
    return ordensFiltradas.reduce((total, o) => {
      if (o.ordem_status !== 'cancelada') {
        return total + (o.entrada - o.estorno);
      }
      return total;
    }, 0);
  }, [ordensFiltradas]);

  function imprimir() {
    window.print();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Financeiro</h1>
        <p>Resumo financeiro por ordem</p>
      </div>

      {/* CONTROLES */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {/* Status */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${filtroStatus === 'aberta' ? 'btn-primary' : ''}`}
            onClick={() => setFiltroStatus('aberta')}
          >
            Abertas
          </button>

          <button
            className={`btn ${filtroStatus === 'cancelada' ? 'btn-danger' : ''}`}
            onClick={() => setFiltroStatus('cancelada')}
          >
            Canceladas
          </button>

          <button className="btn" onClick={() => setFiltroStatus('todas')}>
            Todas
          </button>
        </div>

        {/* Período */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${filtroPeriodo === 'semana' ? 'btn-primary' : ''}`}
            onClick={() => setFiltroPeriodo('semana')}
          >
            Semana
          </button>

          <button
            className={`btn ${filtroPeriodo === 'mes' ? 'btn-primary' : ''}`}
            onClick={() => setFiltroPeriodo('mes')}
          >
            Mês
          </button>

          <button className="btn" onClick={() => setFiltroPeriodo('tudo')}>
            Tudo
          </button>
        </div>

        {/* Total + impressão */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <strong style={{ color: 'var(--success)' }}>
            Total: R$ {totalAbertas.toFixed(2)}
          </strong>

          <button className="btn" onClick={imprimir}>
            Imprimir
          </button>
        </div>
      </div>

      <div className="page-content">
        <table>
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Entrada</th>
              <th>Estorno</th>
              <th>Saldo</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {ordensFiltradas.map((o) => {
              const saldo =
                o.ordem_status === 'cancelada'
                  ? 0
                  : o.entrada - o.estorno;

              return (
                <tr key={o.ordem_id}>
                  <td>#{o.ordem_id}</td>
                  <td>{new Date(o.data).toLocaleString()}</td>
                  <td style={{ textTransform: 'uppercase' }}>
                    {o.tipo_composicao}
                  </td>
                  <td className="valor-entrada">R$ {o.entrada.toFixed(2)}</td>
                  <td className="valor-saida">R$ {o.estorno.toFixed(2)}</td>
                  <td style={{ fontWeight: 600 }}>R$ {saldo.toFixed(2)}</td>
                  <td>
                    <BadgeStatus status={o.ordem_status} />
                  </td>
                </tr>
              );
            })}

            {ordensFiltradas.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
