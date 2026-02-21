import { useEffect, useState } from 'react';
import api from '../../lib/api';
import './FinanceiroExtraPage.css';

export default function FinanceiroExtraPage() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [tipo, setTipo] = useState('despesa');
  const [categoriaId, setCategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [observacao, setObservacao] = useState('');
  const [periodo, setPeriodo] = useState('mes');

  useEffect(() => {
    carregarTudo();
  }, [periodo]);

  async function carregarTudo() {
    const [mov, cat] = await Promise.all([
      api.get(`/financeiro-extra?periodo=${periodo}`),
      api.get('/financeiro-extra/categorias')
    ]);

    setMovimentacoes(mov.data);
    setCategorias(cat.data);
  }

  async function salvar(e) {
    e.preventDefault();

    await api.post('/financeiro-extra', {
      tipo,
      categoria_id: categoriaId,
      descricao,
      valor,
      data_lancamento: data,
      observacao
    });

    limparFormulario();
    carregarTudo();
  }

  function limparFormulario() {
    setDescricao('');
    setValor('');
    setData('');
    setObservacao('');
  }

  async function marcarPago(id) {
    await api.put(`/financeiro-extra/${id}`, { status: 'pago' });
    carregarTudo();
  }

  async function remover(id) {
    if (!window.confirm('Remover este lançamento?')) return;
    await api.delete(`/financeiro-extra/${id}`);
    carregarTudo();
  }

  async function criarCategoria() {
    const nome = prompt('Nome da categoria:');
    if (!nome) return;

    await api.post('/financeiro-extra/categorias', { nome, tipo });
    carregarTudo();
  }

  const despesas = movimentacoes.filter(m => m.tipo === 'despesa');
  const compromissos = movimentacoes.filter(m => m.tipo === 'compromisso');

  const totalDespesas = despesas.reduce((t, m) => t + Number(m.valor), 0);
  const totalCompromissos = compromissos.reduce((t, m) => t + Number(m.valor), 0);
  const totalPendente = compromissos
    .filter(m => m.status !== 'pago')
    .reduce((t, m) => t + Number(m.valor), 0);

  return (
    <div className="page">
      <div className="financeiro-extra-container">

        <h1>Despesas e Compromissos</h1>

        {/* RESUMO */}
        <div className="resumo-grid">
          <Resumo titulo="Despesas" valor={totalDespesas} />
          <Resumo titulo="Compromissos" valor={totalCompromissos} />
          <Resumo titulo="A pagar" valor={totalPendente} />
        </div>

        {/* FILTROS */}
        <div className="periodo-controls">
          <button className="btn" onClick={() => setPeriodo('semana')}>Semana</button>
          <button className="btn" onClick={() => setPeriodo('mes')}>Mês</button>
          <button className="btn" onClick={() => setPeriodo('tudo')}>Tudo</button>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={salvar} className="card financeiro-form">
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
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

          <button type="button" className="btn" onClick={criarCategoria}>
            + Categoria
          </button>

          <input
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
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />

          <input
            placeholder="Observação"
            value={observacao}
            onChange={e => setObservacao(e.target.value)}
          />

          <button className="btn btn-primary">
            Salvar
          </button>
        </form>

        {/* GRID PRINCIPAL */}
        <div className="financeiro-grid">
          <CardMovimentos
            titulo="Despesas"
            dados={despesas}
            total={totalDespesas}
            onRemover={remover}
          />

          <CardMovimentos
            titulo="Compromissos"
            dados={compromissos}
            total={totalCompromissos}
            onRemover={remover}
            onMarcarPago={marcarPago}
          />
        </div>

      </div>
    </div>
  );
}

function Resumo({ titulo, valor }) {
  return (
    <div className="resumo-card">
      <strong>{titulo}</strong>
      <div>R$ {valor.toFixed(2)}</div>
    </div>
  );
}

function CardMovimentos({ titulo, dados, total, onRemover, onMarcarPago }) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
      <p><strong>Total:</strong> R$ {total.toFixed(2)}</p>

      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Obs.</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dados.map(m => (
              <tr key={m.id}>
                <td>{m.categoria_nome}</td>
                <td>{m.descricao || '-'}</td>
                <td>{m.observacao || '-'}</td>
                <td>R$ {Number(m.valor).toFixed(2)}</td>
                <td>
                  {m.data ? new Date(m.data).toLocaleDateString() : '-'}
                </td>
                <td>{m.status === 'pago' ? 'Pago' : 'Pendente'}</td>
                <td className="acoes-cell">
                  {onMarcarPago && m.status !== 'pago' && (
                    <button className="btn" onClick={() => onMarcarPago(m.id)}>
                      Marcar pago
                    </button>
                  )}

                  <button
                    className="btn btn-danger"
                    onClick={() => onRemover(m.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}

            {dados.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-cell">
                  Nenhum registro
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}