import { useEffect, useState, useMemo } from 'react';
import { listarOrdens } from '../../api/ordens';
import { useNavigate } from 'react-router-dom';
import BadgeStatus from '../../components/BadgeStatus';

export default function OrdensList() {
  const [ordens, setOrdens] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('aberta');
  const [filtroPeriodo, setFiltroPeriodo] = useState('semana'); // semana | mes | tudo

  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarOrdens();
    setOrdens(data);
  }

  // 🔹 Filtro por período usando data_abertura (CORRETO)
  function filtrarPorPeriodo(ordem) {
    if (filtroPeriodo === 'tudo') return true;

    if (!ordem.data_abertura) return false;

    const dataOrdem = new Date(ordem.data_abertura);
    const hoje = new Date();

    if (isNaN(dataOrdem)) return false;

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

  // 🔹 Filtros combinados
  const ordensFiltradas = useMemo(() => {
    return ordens.filter((o) => {
      const statusOk =
        filtroStatus === 'todas' || o.status === filtroStatus;
      const periodoOk = filtrarPorPeriodo(o);
      return statusOk && periodoOk;
    });
  }, [ordens, filtroStatus, filtroPeriodo]);

  // 🔹 Totalizador (ordens abertas)
  const totalAbertas = useMemo(() => {
    return ordensFiltradas.reduce((total, o) => {
      if (o.status !== 'cancelada') {
        return total + Number(o.valor_total);
      }
      return total;
    }, 0);
  }, [ordensFiltradas]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Ordens</h1>
        <p>Controle de ordens por período e status</p>
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
            className={`btn ${
              filtroStatus === 'cancelada' ? 'btn-danger' : ''
            }`}
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
            className={`btn ${
              filtroPeriodo === 'semana' ? 'btn-primary' : ''
            }`}
            onClick={() => setFiltroPeriodo('semana')}
          >
            Semana
          </button>

          <button
            className={`btn ${
              filtroPeriodo === 'mes' ? 'btn-primary' : ''
            }`}
            onClick={() => setFiltroPeriodo('mes')}
          >
            Mês
          </button>

          <button className="btn" onClick={() => setFiltroPeriodo('tudo')}>
            Tudo
          </button>
        </div>

        {/* Total + ação */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <strong style={{ color: 'var(--success)' }}>
            Total: R$ {totalAbertas.toFixed(2)}
          </strong>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/ordens/nova')}
          >
            Nova Ordem
          </button>
        </div>
      </div>

      <div className="page-content">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {ordensFiltradas.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>
                  {o.data_abertura
                    ? new Date(o.data_abertura).toLocaleDateString()
                    : '-'}
                </td>
                <td>{o.cliente_id}</td>
                <td>R$ {Number(o.valor_total).toFixed(2)}</td>
                <td>
                  <BadgeStatus status={o.status} />
                </td>
                <td>
                  <button
                    className="btn"
                    onClick={() => navigate(`/ordens/${o.id}`)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}

            {ordensFiltradas.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhuma ordem encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
