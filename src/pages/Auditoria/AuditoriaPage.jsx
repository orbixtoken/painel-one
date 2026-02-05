import { useEffect, useState } from 'react';
import { listarAuditoria } from '../../api/auditoria';

export default function AuditoriaPage() {
  const [auditoria, setAuditoria] = useState([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarAuditoria();
    setAuditoria(data);
  }

  /* =========================
     AGRUPAR POR DATA (DIA)
  ========================= */
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
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* CABEÇALHO */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 600 }}>
            Auditoria do Sistema
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>
            Registro completo de todas as ações realizadas
          </p>
        </div>

        {/* CONTEÚDO */}
        {diasOrdenados.length === 0 && (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            Nenhum registro encontrado
          </div>
        )}

        {diasOrdenados.map(dia => (
          <div key={dia} style={{ marginBottom: 32 }}>

            {/* DATA */}
            <div
              style={{
                marginBottom: 12,
                fontSize: 15,
                fontWeight: 600,
                color: '#e5e7eb'
              }}
            >
              {dia}
            </div>

            {/* TABELA DO DIA */}
            <div className="card" style={{ padding: 0 }}>
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={th}>Hora</th>
                    <th style={th}>Tipo</th>
                    <th style={th}>Cliente</th>
                    <th style={th}>Ordem</th>
                    <th style={th}>Valor</th>
                    <th style={th}>Descrição</th>
                    <th style={th}>Responsável</th>
                  </tr>
                </thead>

                <tbody>
                  {auditoriaPorDia[dia].map((a, index) => (
                    <tr key={index}>
                      <td style={td}>
                        {new Date(a.data).toLocaleTimeString()}
                      </td>

                      <td style={td}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#fff',
                            backgroundColor: corTipo(a.tipo)
                          }}
                        >
                          {a.tipo.toUpperCase()}
                        </span>
                      </td>

                      <td style={td}>{a.cliente_id || '-'}</td>
                      <td style={td}>{a.ordem_id || '-'}</td>

                      <td style={td}>
                        {a.valor !== null ? (
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                a.valor >= 0 ? '#16a34a' : '#dc2626'
                            }}
                          >
                            R$ {Number(a.valor).toFixed(2)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td style={td}>{a.descricao}</td>

                      <td style={td}>
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
        ))}

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
