import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarCliente } from '../../api/clientes';

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
      <div style={{ maxWidth: 520, margin: '0 auto' }}>

        {/* CABEÇALHO */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 600 }}>
            Novo Cliente
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>
            Preencha os dados para cadastrar um novo cliente
          </p>
        </div>

        {/* FORMULÁRIO */}
        <div className="card">

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Nome *
            </label>
            <input
              style={{
                marginTop: 4,
                padding: '10px 12px',
                fontSize: 14
              }}
              placeholder="Nome completo do cliente"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Telefone
            </label>
            <input
              style={{
                marginTop: 4,
                padding: '10px 12px',
                fontSize: 14
              }}
              placeholder="(00) 00000-0000"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>
              Documento
            </label>
            <input
              style={{
                marginTop: 4,
                padding: '10px 12px',
                fontSize: 14
              }}
              placeholder="CPF ou CNPJ"
              value={documento}
              onChange={e => setDocumento(e.target.value)}
            />
          </div>

          {/* AÇÕES */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20
            }}
          >
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
              style={{ minWidth: 140 }}
            >
              {salvando ? 'Salvando...' : 'Criar Cliente'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
