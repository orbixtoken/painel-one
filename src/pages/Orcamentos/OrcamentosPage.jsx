import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarOrcamentos } from '../../api/orcamentos';
import BadgeStatus from '../../components/BadgeStatus';

export default function OrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState([]);
  const [filtro, setFiltro] = useState('ativos');
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarOrcamentos();
    setOrcamentos(data);
  }

  const orcamentosFiltrados = orcamentos.filter(o => {
    if (filtro === 'ativos') return o.status !== 'cancelado';
    if (filtro === 'cancelados') return o.status === 'cancelado';
    return true;
  });

  return (
    <div className="page">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* CABEÇALHO */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24
          }}
        >
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 600 }}>
              Orçamentos
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              Controle e acompanhamento de orçamentos
            </p>
          </div>

          <button
            className="btn btn-primary"
            style={{ padding: '10px 18px', fontSize: 14 }}
            onClick={() => navigate('/orcamentos/novo')}
          >
            + Novo Orçamento
          </button>
        </div>

        {/* FILTRO */}
        <div style={{ marginBottom: 16 }}>
          <select
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: 14,
              borderRadius: 8
            }}
          >
            <option value="ativos">Ativos</option>
            <option value="cancelados">Cancelados</option>
            <option value="todos">Todos</option>
          </select>
        </div>

        {/* LISTA */}
        {orcamentosFiltrados.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: 48
            }}
          >
            <strong style={{ fontSize: 16 }}>
              Nenhum orçamento encontrado
            </strong>
            <p style={{ marginTop: 8, color: '#94a3b8' }}>
              Crie um orçamento para iniciar negociações com clientes.
            </p>

            <button
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={() => navigate('/orcamentos/novo')}
            >
              Criar primeiro orçamento
            </button>
          </div>
        ) : (
          <div className="card" style={{ padding: 0 }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={th}>#</th>
                  <th style={th}>Cliente</th>
                  <th style={th}>Status</th>
                  <th style={th}>Valor</th>
                  <th style={th}>Validade</th>
                  <th style={th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {orcamentosFiltrados.map(o => (
                  <tr key={o.id}>
                    <td style={td}>{o.id}</td>

                    <td style={td}>
                      <strong>{o.cliente_nome || '-'}</strong>
                    </td>

                    <td style={td}>
                      <BadgeStatus status={o.status} />
                    </td>

                    <td style={td}>
                      R$ {Number(o.valor_total).toFixed(2)}
                    </td>

                    <td style={td}>
                      {o.validade
                        ? new Date(o.validade).toLocaleDateString()
                        : '-'}
                    </td>

                    <td style={td}>
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`/orcamentos/${o.id}`)}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

/* =========================
   ESTILOS PADRÃO
========================= */
const th = {
  textAlign: 'left',
  padding: '14px 16px',
  fontSize: 13,
  fontWeight: 600,
  opacity: 0.8
};

const td = {
  padding: '14px 16px',
  fontSize: 14
};
