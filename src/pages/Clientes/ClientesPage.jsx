import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { salvarClientesOffline, listarClientesOffline } from '../../lib/offline/clientesCache';
import {
  listarClientes,
  atualizarCliente
} from '../../api/clientes';



export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('ativo'); // 🔥 padrão
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

 async function carregar() {
  try {
    const data = await listarClientes(); // API

    setClientes(data);

    await salvarClientesOffline(data);
  } catch {
    const offline = await listarClientesOffline();
    setClientes(offline);
  }
}

  async function inativar(cliente) {
    if (!window.confirm('Inativar este cliente?')) return;

    await atualizarCliente(cliente.id, {
      nome: cliente.nome,
      telefone: cliente.telefone,
      documento: cliente.documento,
      ativo: false
    });

    carregar();
  }
   
  /* =========================
     FILTRO
  ========================= */
  const clientesFiltrados = clientes.filter(c => {
    if (filtroStatus === 'ativo') return c.ativo;
    if (filtroStatus === 'inativo') return !c.ativo;
    return true; // todos
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
              Clientes
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              Controle e gerenciamento de clientes
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {/* 🔍 FILTRO */}
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
              style={{
                height: 38,
                padding: '0 12px',
                fontSize: 14,
                borderRadius: 6
              }}
            >
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="todos">Todos</option>
            </select>

            <button
              className="btn btn-primary"
              style={{ padding: '10px 18px', fontSize: 14 }}
              onClick={() => navigate('/clientes/novo')}
            >
              + Novo Cliente
            </button>
          </div>
        </div>

        {/* LISTA */}
        {clientesFiltrados.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: 48
            }}
          >
            <strong style={{ fontSize: 16 }}>
              Nenhum cliente encontrado
            </strong>

            <p style={{ marginTop: 8, color: '#94a3b8' }}>
              Não existem clientes para o filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>#</th>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Status</th>
                  <th style={{ width: 200 }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>

                    <td>
                      <strong style={{ fontSize: 14 }}>
                        {c.nome}
                      </strong>
                    </td>

                    <td>{c.telefone || '-'}</td>

                    <td>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 14,
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#fff',
                          backgroundColor: c.ativo
                            ? '#16a34a'   // verde
                            : '#dc2626'   // vermelho
                        }}
                      >
                        {c.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8
                        }}
                      >
                        <button
                          className="btn-secondary"
                          style={{ padding: '6px 12px' }}
                          onClick={() =>
                            navigate(`/clientes/${c.id}`)
                          }
                        >
                          Ver
                        </button>

                        {c.ativo && (
                          <button
                            className="btn-danger"
                            style={{ padding: '6px 12px' }}
                            onClick={() => inativar(c)}
                          >
                            Inativar
                          </button>
                        )}
                      </div>
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
