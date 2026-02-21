import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  listarClientes,
  atualizarCliente
} from '../../api/clientes';
import './ClientesPage.css';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('ativo');
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarClientes();
    setClientes(data);
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

  const clientesFiltrados = clientes.filter(c => {
    if (filtroStatus === 'ativo') return c.ativo;
    if (filtroStatus === 'inativo') return !c.ativo;
    return true;
  });

  return (
    <div className="page">
      <div className="clientes-container">

        {/* HEADER */}
        <div className="clientes-header">
          <div>
            <h1>Clientes</h1>
            <p>Controle e gerenciamento de clientes</p>
          </div>

          <div className="clientes-actions">
            <select
              value={filtroStatus}
              onChange={e => setFiltroStatus(e.target.value)}
              className="clientes-select"
            >
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="todos">Todos</option>
            </select>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/clientes/novo')}
            >
              + Novo Cliente
            </button>
          </div>
        </div>

        {/* LISTA */}
        {clientesFiltrados.length === 0 ? (
          <div className="card clientes-empty">
            <strong>Nenhum cliente encontrado</strong>
            <p>Não existem clientes para o filtro selecionado.</p>
          </div>
        ) : (
          <div className="card clientes-card">
            <div className="table-wrapper">
              <table className="responsive-table">
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
                        <strong className="cliente-nome">
                          {c.nome}
                        </strong>
                      </td>

                      <td>{c.telefone || '-'}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            c.ativo ? 'ativo' : 'inativo'
                          }`}
                        >
                          {c.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>

                      <td>
                        <div className="acoes-col">
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              navigate(`/clientes/${c.id}`)
                            }
                          >
                            Ver
                          </button>

                          {c.ativo && (
                            <button
                              className="btn btn-danger"
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
          </div>
        )}

      </div>
    </div>
  );
}