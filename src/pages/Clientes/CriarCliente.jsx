import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarCliente } from '../../api/clientes';
import './CriarCliente.css';

export default function CriarCliente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    if (!nome.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    try {
      setSalvando(true);

      await criarCliente({
        nome,
        telefone: telefone || null,
        documento: documento || null
      });

      navigate('/clientes');
    } catch {
      alert('Erro ao criar cliente');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="page">
      <div className="criar-cliente-container">

        {/* HEADER */}
        <div className="criar-cliente-header">
          <h1>Novo Cliente</h1>
          <p>Preencha os dados para cadastrar um novo cliente</p>
        </div>

        {/* FORM */}
        <div className="card criar-cliente-card">

          <div className="form-group">
            <label>Nome *</label>
            <input
              placeholder="Nome completo do cliente"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Documento</label>
            <input
              placeholder="CPF ou CNPJ"
              value={documento}
              onChange={e => setDocumento(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button
              className="btn"
              onClick={() => navigate('/clientes')}
            >
              Cancelar
            </button>

            <button
              className="btn btn-primary"
              onClick={salvar}
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Criar Cliente'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}