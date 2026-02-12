import { useEffect, useState } from 'react';
import {
  listarMovimentacoes,
  criarMovimentacao
} from '../../api/financeiroExtra';

export default function FinanceiroExtraPage() {
  const [movs, setMovs] = useState([]);
  const [form, setForm] = useState({
    tipo: 'despesa',
    categoria: '',
    descricao: '',
    valor: '',
    data_movimento: '',
    data_vencimento: '',
    observacao: ''
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const data = await listarMovimentacoes();
    setMovs(data);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function salvar(e) {
    e.preventDefault();
    await criarMovimentacao(form);
    setForm({
      tipo: 'despesa',
      categoria: '',
      descricao: '',
      valor: '',
      data_movimento: '',
      data_vencimento: '',
      observacao: ''
    });
    carregar();
  }

  const totalDespesas = movs
    .filter(m => m.tipo === 'despesa')
    .reduce((t, m) => t + Number(m.valor), 0);

  const totalCompromissos = movs
    .filter(m => m.tipo === 'compromisso')
    .reduce((t, m) => t + Number(m.valor), 0);

  return (
    <div className="page">
      <h1>Despesas e Compromissos</h1>

      {/* RESUMO */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <strong>Despesas:</strong>
          <div>R$ {totalDespesas.toFixed(2)}</div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <strong>Compromissos:</strong>
          <div>R$ {totalCompromissos.toFixed(2)}</div>
        </div>
      </div>

      {/* FORM */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={salvar} style={{ display: 'grid', gap: 10 }}>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
          >
            <option value="despesa">Despesa</option>
            <option value="compromisso">Compromisso</option>
          </select>

          <input
            name="categoria"
            placeholder="Categoria"
            value={form.categoria}
            onChange={handleChange}
            required
          />

          <input
            name="descricao"
            placeholder="Descrição"
            value={form.descricao}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            step="0.01"
            name="valor"
            placeholder="Valor"
            value={form.valor}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="data_movimento"
            value={form.data_movimento}
            onChange={handleChange}
            required
          />

          {form.tipo === 'compromisso' && (
            <input
              type="date"
              name="data_vencimento"
              value={form.data_vencimento}
              onChange={handleChange}
            />
          )}

          <input
            name="observacao"
            placeholder="Observação"
            value={form.observacao}
            onChange={handleChange}
          />

          <button className="btn btn-primary">
            Salvar
          </button>
        </form>
      </div>

      {/* LISTA */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {movs.map(m => (
              <tr key={m.id}>
                <td>{m.tipo}</td>
                <td>{m.categoria}</td>
                <td>{m.descricao}</td>
                <td>R$ {Number(m.valor).toFixed(2)}</td>
                <td>{m.data_movimento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
