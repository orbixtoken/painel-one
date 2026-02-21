import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  buscarCliente,
  atualizarCliente
} from '../../api/clientes';

import api from '../../lib/api';
import BadgeStatus from '../../components/BadgeStatus';
import './ClienteDetalhe.css';

export default function ClienteDetalhe() {
  const { id } = useParams();

  const [cliente, setCliente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarTudo();
    // eslint-disable-next-line
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
      <div className="cliente-detalhe-container">

        {/* HEADER */}
        <div className="cliente-header">
          <div>
            <h1>Cliente #{cliente.id}</h1>
            <p>Detalhes completos e histórico do cliente</p>
          </div>

          <BadgeStatus
            status={cliente.ativo ? 'ativo' : 'inativo'}
          />
        </div>

        {/* DADOS */}
        <div className="card cliente-card">
          <h3>Dados do Cliente</h3>

          <div className="form-grid">

            <div className="form-group">
              <label>Nome *</label>
              <input
                value={cliente.nome}
                onChange={e =>
                  setCliente({ ...cliente, nome: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Telefone</label>
              <input
                value={cliente.telefone || ''}
                onChange={e =>
                  setCliente({ ...cliente, telefone: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Documento</label>
              <input
                value={cliente.documento || ''}
                onChange={e =>
                  setCliente({ ...cliente, documento: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
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

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={salvar}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="card historico-card">
          <h3>Histórico Completo</h3>

          {historico.length === 0 && (
            <p className="historico-vazio">
              Nenhum histórico encontrado para este cliente.
            </p>
          )}

          {historico.length > 0 && (
            <div className="table-wrapper">
              <table className="responsive-table">
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

                      <td className="tipo-col">
                        {h.tipo.toUpperCase()}
                      </td>

                      <td>{h.descricao}</td>

                      <td
                        className={
                          h.valor === null
                            ? 'valor-neutro'
                            : h.valor < 0
                            ? 'valor-negativo'
                            : 'valor-positivo'
                        }
                      >
                        {h.valor !== null
                          ? `R$ ${Number(h.valor).toFixed(2)}`
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}