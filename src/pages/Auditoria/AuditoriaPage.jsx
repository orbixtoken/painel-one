import { useEffect, useState } from 'react';
import { listarAuditoria } from '../../api/auditoria';
import './AuditoriaPage.css';

export default function AuditoriaPage() {
  const [auditoria, setAuditoria] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarAuditoria();
    setAuditoria(data);
  }

  const auditoriaPorDia = auditoria.reduce((acc, item) => {
    const dia = new Date(item.data).toLocaleDateString();
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(item);
    return acc;
  }, {});

  const diasOrdenados = Object.keys(auditoriaPorDia).sort((a, b) => {
    return new Date(b.split('/').reverse().join('-')) -
           new Date(a.split('/').reverse().join('-'));
  });

  function corTipo(tipo) {
    if (tipo === 'financeiro') return '#16a34a';
    if (tipo === 'ordem') return '#2563eb';
    if (tipo === 'cliente') return '#7c3aed';
    return '#64748b';
  }

  return (
    <div className="page">
      <div className="auditoria-container">

        <div className="auditoria-header">
          <h1>Auditoria do Sistema</h1>
          <p>Registro completo de todas as ações realizadas</p>
        </div>

        {diasOrdenados.length === 0 && (
          <div className="card auditoria-empty">
            Nenhum registro encontrado
          </div>
        )}

        {diasOrdenados.map(dia => (
          <div key={dia} className="auditoria-dia">

            <div className="auditoria-data">
              {dia}
            </div>

            <div className="card auditoria-card">
              <div className="table-wrapper">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Tipo</th>
                      <th>Cliente</th>
                      <th>Ordem</th>
                      <th>Valor</th>
                      <th>Descrição</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditoriaPorDia[dia].map((a, index) => (
                      <tr key={index}>
                        <td>
                          {new Date(a.data).toLocaleTimeString()}
                        </td>

                        <td>
                          <span
                            className="tipo-badge"
                            style={{ backgroundColor: corTipo(a.tipo) }}
                          >
                            {a.tipo.toUpperCase()}
                          </span>
                        </td>

                        <td>{a.cliente_id || '-'}</td>
                        <td>{a.ordem_id || '-'}</td>

                        <td>
                          {a.valor !== null ? (
                            <span
                              className={
                                a.valor >= 0
                                  ? 'valor-positivo'
                                  : 'valor-negativo'
                              }
                            >
                              R$ {Number(a.valor).toFixed(2)}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>

                        <td className="descricao-col">
                          {a.descricao}
                        </td>

                        <td>
                          {a.responsavel_nome
                            ? `${a.responsavel_nome} (#${a.responsavel_id})`
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}