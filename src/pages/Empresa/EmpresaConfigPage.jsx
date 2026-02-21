import { useEffect, useState } from 'react';
import {
  buscarEmpresaConfig,
  atualizarEmpresaConfig
} from '../../api/empresa';
import './EmpresaConfigPage.css';

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
    if (!form.nome.trim()) {
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
      <div className="empresa-container">

        <div className="empresa-header">
          <h1>Configurações da Empresa</h1>
          <p>
            Informações utilizadas em orçamentos, PDFs e documentos oficiais.
          </p>
        </div>

        {/* DADOS */}
        <div className="card">
          <h3>Dados da Empresa</h3>

          <div className="form-group">
            <label>Nome da empresa *</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Telefone</label>
              <input
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>WhatsApp</label>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ORÇAMENTOS */}
        <div className="card">
          <h3>Orçamentos e Documentos</h3>

          <div className="form-group">
            <label>Mensagem padrão do orçamento</label>
            <textarea
              name="mensagem_orcamento"
              value={form.mensagem_orcamento}
              onChange={handleChange}
              placeholder="Texto exibido automaticamente no PDF do orçamento"
            />
          </div>

          <p className="form-help">
            Essa mensagem aparece no rodapé dos orçamentos em PDF.
          </p>
        </div>

        {/* OBSERVAÇÕES */}
        <div className="card">
          <h3>Observações Internas</h3>

          <div className="form-group">
            <textarea
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              placeholder="Uso interno. Não aparece para o cliente."
            />
          </div>
        </div>

        {/* AÇÕES */}
        <div className="empresa-actions">
          <button
            className="btn btn-primary"
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