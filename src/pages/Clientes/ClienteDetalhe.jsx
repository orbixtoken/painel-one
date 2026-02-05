import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  buscarCliente,
  atualizarCliente
} from '../../api/clientes';

import api from '../../lib/api';
import BadgeStatus from '../../components/BadgeStatus';

export default function ClienteDetalhe() {
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function carregarTudo() {
    try {
      setLoading(true);

      const clienteData = await buscarCliente(id);
      setCliente(clienteData);

      const { data } = await api.get(
        `/clientes/${id}/historico-completo`
      );
      setHistorico(data);
    } catch (err) {
      console.error(err);
      setHistorico([]);
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!cliente.nome?.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    try {
      setSalvando(true);

      await atualizarCliente(id, {
        nome: cliente.nome,
        telefone: cliente.telefone || null,
        endereco: cliente.endereco || null,
        documento: cliente.documento || null,
        ativo: cliente.ativo
      });

      alert('Cliente atualizado com sucesso');
      carregarTudo();
    } catch {
      alert('Erro ao atualizar cliente');
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <p>Carregando cliente...</p>;
  if (!cliente) return <p>Cliente não encontrado</p>;

  return (
    <div className="page">
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* CABEÇALHO */}
        <div className="page-header" style={{ marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700 }}>
              Cliente #{cliente.id}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 16 }}>
              Detalhes completos e histórico do cliente
            </p>
          </div>

          <BadgeStatus
            status={cliente.ativo ? 'ativo' : 'inativo'}
          />
        </div>

        {/* DADOS DO CLIENTE */}
        <div className="card" style={{ marginBottom: 40 }}>
          <h3 style={{ marginBottom: 20, fontSize: 22 }}>
            Dados do Cliente
          </h3>

          <div className="grid-2" style={{ gap: 20 }}>
            <div>
              <label style={{ fontSize: 15 }}>Nome *</label>
              <input
                style={{ fontSize: 16, height: 44 }}
                value={cliente.nome}
                onChange={e =>
                  setCliente({ ...cliente, nome: e.target.value })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: 15 }}>Telefone</label>
              <input
                style={{ fontSize: 16, height: 44 }}
                value={cliente.telefone || ''}
                onChange={e =>
                  setCliente({ ...cliente, telefone: e.target.value })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: 15 }}>Documento</label>
              <input
                style={{ fontSize: 16, height: 44 }}
                value={cliente.documento || ''}
                onChange={e =>
                  setCliente({ ...cliente, documento: e.target.value })
                }
              />
            </div>

            <div>
              <label style={{ fontSize: 15 }}>Status</label>
              <select
                style={{ fontSize: 16, height: 44 }}
                value={cliente.ativo}
                onChange={e =>
                  setCliente({
                    ...cliente,
                    ativo: e.target.value === 'true'
                  })
                }
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: 16, padding: '12px 28px' }}
              onClick={salvar}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: 22 }}>
            Histórico Completo
          </h3>

          {historico.length === 0 && (
            <p style={{ color: '#94a3b8', fontSize: 15 }}>
              Nenhum histórico encontrado para este cliente.
            </p>
          )}

          {historico.length > 0 && (
            <table style={{ fontSize: 15 }}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                </tr>
              </thead>

              <tbody>
                {historico.map((h, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(h.data).toLocaleString()}
                    </td>

                    <td style={{ fontWeight: 600 }}>
                      {h.tipo.toUpperCase()}
                    </td>

                    <td>{h.descricao}</td>

                    <td
                      style={{
                        fontWeight: 700,
                        color:
                          h.valor === null
                            ? '#94a3b8'
                            : h.valor < 0
                            ? '#dc2626'
                            : '#16a34a'
                      }}
                    >
                      {h.valor !== null
                        ? `R$ ${Number(h.valor).toFixed(2)}`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
