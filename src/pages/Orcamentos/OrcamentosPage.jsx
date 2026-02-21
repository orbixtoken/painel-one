import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarOrcamentos } from '../../api/orcamentos';
import BadgeStatus from '../../components/BadgeStatus';
import './OrcamentosPage.css';

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
      <div className="orcamentos-container">

        {/* HEADER */}
        <div className="orcamentos-header">
          <div>
            <h1>Orçamentos</h1>
            <p>Controle e acompanhamento de orçamentos</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/orcamentos/novo')}
          >
            + Novo Orçamento
          </button>
        </div>

        {/* FILTRO */}
        <div className="orcamentos-filtro">
          <select
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          >
            <option value="ativos">Ativos</option>
            <option value="cancelados">Cancelados</option>
            <option value="todos">Todos</option>
          </select>
        </div>

        {/* LISTA */}
        {orcamentosFiltrados.length === 0 ? (
          <div className="card empty-state">
            <strong>Nenhum orçamento encontrado</strong>
            <p>
              Crie um orçamento para iniciar negociações com clientes.
            </p>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/orcamentos/novo')}
            >
              Criar primeiro orçamento
            </button>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th>Validade</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {orcamentosFiltrados.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>

                      <td>
                        <strong>{o.cliente_nome || '-'}</strong>
                      </td>

                      <td>
                        <BadgeStatus status={o.status} />
                      </td>

                      <td>
                        R$ {Number(o.valor_total).toFixed(2)}
                      </td>

                      <td>
                        {o.validade
                          ? new Date(o.validade).toLocaleDateString()
                          : '-'}
                      </td>

                      <td>
                        <button
                          className="btn"
                          onClick={() =>
                            navigate(`/orcamentos/${o.id}`)
                          }
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}