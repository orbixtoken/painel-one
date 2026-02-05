import { useEffect, useState } from 'react';
import {
  buscarEmpresaConfig,
  atualizarEmpresaConfig
} from '../../api/empresa';

export default function EmpresaConfigPage() {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    whatsapp: '',
    endereco: '',
    mensagem_orcamento: '',
    observacoes: ''
  });

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await buscarEmpresaConfig();
      setForm({
        nome: data.nome || '',
        telefone: data.telefone || '',
        whatsapp: data.whatsapp || '',
        endereco: data.endereco || '',
        mensagem_orcamento: data.mensagem_orcamento || '',
        observacoes: data.observacoes || ''
      });
    } catch {
      alert('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function salvar() {
    if (!form.nome) {
      alert('Nome da empresa é obrigatório');
      return;
    }

    try {
      setSalvando(true);
      await atualizarEmpresaConfig(form);
      alert('Configuração da empresa salva com sucesso');
    } catch {
      alert('Erro ao salvar configuração');
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return <p>Carregando configuração da empresa...</p>;
  }

  return (
    <div className="page">
      <div style={{ maxWidth: 880, margin: '0 auto' }}>

        {/* TÍTULO */}
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>
          Configurações da Empresa
        </h1>

        <p style={{ color: '#94a3b8', marginBottom: 24 }}>
          Informações utilizadas em orçamentos, PDFs e documentos oficiais.
        </p>

        {/* DADOS PRINCIPAIS */}
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>
            Dados da Empresa
          </h3>

          <label style={label}>Nome da empresa *</label>
          <input
            style={input}
            name="nome"
            value={form.nome}
            onChange={handleChange}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 14
            }}
          >
            <div>
              <label style={label}>Telefone</label>
              <input
                style={input}
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={label}>WhatsApp</label>
              <input
                style={input}
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={{ ...label, marginTop: 14 }}>
            Endereço
          </label>
          <input
            style={input}
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
          />
        </div>

        {/* ORÇAMENTO */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>
            Orçamentos e Documentos
          </h3>

          <label style={label}>
            Mensagem padrão do orçamento
          </label>

          <textarea
            style={{ ...input, height: 110 }}
            name="mensagem_orcamento"
            value={form.mensagem_orcamento}
            onChange={handleChange}
            placeholder="Texto exibido automaticamente no PDF do orçamento"
          />

          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
            Essa mensagem aparece no rodapé dos orçamentos em PDF.
          </p>
        </div>

        {/* OBSERVAÇÕES */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>
            Observações Internas
          </h3>

          <textarea
            style={{ ...input, height: 90 }}
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            placeholder="Uso interno. Não aparece para o cliente."
          />
        </div>

        {/* AÇÕES */}
        <div style={{ marginTop: 28 }}>
          <button
            className="btn btn-primary"
            style={{ padding: '10px 26px' }}
            onClick={salvar}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar Configuração'}
          </button>
        </div>

      </div>
    </div>
  );
}

/* =========================
   ESTILOS BASE
========================= */
const label = {
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 6,
  display: 'block'
};

const input = {
  width: '100%',
  padding: '10px 12px',
  fontSize: 14,
  borderRadius: 6
};
