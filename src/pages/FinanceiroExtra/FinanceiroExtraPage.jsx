import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function FinanceiroExtraPage() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [tipo, setTipo] = useState('despesa');
  const [categoriaId, setCategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataLancamento, setDataLancamento] = useState('');
  const [observacao, setObservacao] = useState('');

  const [periodo, setPeriodo] = useState('mes');

  useEffect(() => {
    carregarCategorias();
    carregarMovimentacoes();
  }, [periodo]);

  async function carregarCategorias() {
    const { data } = await api.get('/financeiro-extra/categorias');
    setCategorias(data);
  }

  async function carregarMovimentacoes() {
    const { data } = await api.get(
      `/financeiro-extra?periodo=${periodo}`
    );
    setMovimentacoes(data);
  }

  async function salvar(e) {
    e.preventDefault();

    await api.post('/financeiro-extra', {
      tipo,
      categoria_id: categoriaId,
      descricao,
      valor,
      data_lancamento: dataLancamento,
      observacao
    });

    setDescricao('');
    setValor('');
    setDataLancamento('');
    setObservacao('');

    carregarMovimentacoes();
  }

  async function marcarComoPago(id) {
    await api.put(`/financeiro-extra/${id}`, {
      status: 'pago'
    });

    carregarMovimentacoes();
  }

  // =============================
  // RESUMO
  // =============================
  const totalDespesas = movimentacoes
    .filter(m => m.tipo === 'despesa')
    .reduce((s, m) => s + Number(m.valor), 0);

  const totalCompromissos = movimentacoes
    .filter(m => m.tipo === 'compromisso')
    .reduce((s, m) => s + Number(m.valor), 0);

  const totalAPagar = movimentacoes
    .filter(m => m.tipo === 'compromisso' && m.status !== 'pago')
    .reduce((s, m) => s + Number(m.valor), 0);

  return (
    <div className="page">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1>Despesas e Compromissos</h1>

        {/* RESUMO */}
        <div style={{ display: 'flex', gap: 40, marginBottom: 20 }}>
          <div>
            <strong>Despesas:</strong><br />
            R$ {totalDespesas.toFixed(2)}
          </div>
          <div>
            <strong>Compromissos:</strong><br />
            R$ {totalCompromissos.toFixed(2)}
          </div>
          <div>
            <strong>A pagar:</strong><br />
            R$ {totalAPagar.toFixed(2)}
          </div>
        </div>

        {/* FILTROS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button className="btn" onClick={() => setPeriodo('semana')}>
            Semana
          </button>
          <button className="btn" onClick={() => setPeriodo('mes')}>
            Mês
          </button>
          <button className="btn" onClick={() => setPeriodo('tudo')}>
            Tudo
          </button>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={salvar} className="card" style={{ padding: 16, marginBottom: 20 }}>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            required
          >
            <option value="despesa">Despesa</option>
            <option value="compromisso">Compromisso</option>
          </select>

          <select
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
            required
          >
            <option value="">Categoria</option>
            {categorias
              .filter(c => c.tipo === tipo)
              .map(c => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
          </select>

          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={e => setValor(e.target.value)}
            required
          />

          <input
            type="date"
            value={dataLancamento}
            onChange={e => setDataLancamento(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Observação"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
          />

          <button className="btn btn-primary" type="submit">
            Salvar
          </button>
        </form>

        {/* TABELA */}
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {movimentacoes.map(m => (
                <tr key={m.id}>
                  <td>{m.tipo}</td>
                  <td>{m.categoria_nome}</td>
                  <td>{m.descricao}</td>
                  <td>R$ {Number(m.valor).toFixed(2)}</td>
                  <td>
                    {m.data
                      ? new Date(m.data).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    {m.status === 'pago' ? (
                      <span style={{ color: '#22c55e' }}>Pago</span>
                    ) : (
                      <span style={{ color: '#f59e0b' }}>Pendente</span>
                    )}
                  </td>
                  <td>
                    {m.status !== 'pago' && (
                      <button
                        className="btn btn-success"
                        onClick={() => marcarComoPago(m.id)}
                      >
                        Marcar pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {movimentacoes.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 20 }}>
                    Nenhuma movimentação encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
