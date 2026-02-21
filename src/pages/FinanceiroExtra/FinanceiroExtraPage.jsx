import { useEffect, useState, useMemo } from 'react';
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

  const [abaAtiva, setAbaAtiva] = useState('despesa');

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

  const despesas = useMemo(
    () => movimentacoes.filter(m => m.tipo === 'despesa'),
    [movimentacoes]
  );

  const compromissos = useMemo(
    () => movimentacoes.filter(m => m.tipo === 'compromisso'),
    [movimentacoes]
  );

  const totalDespesas = despesas.reduce((t, m) => t + Number(m.valor), 0);
  const totalCompromissos = compromissos.reduce((t, m) => t + Number(m.valor), 0);
  const totalPendente = compromissos
    .filter(m => m.status !== 'pago')
    .reduce((t, m) => t + Number(m.valor), 0);

  const listaAtual = abaAtiva === 'despesa' ? despesas : compromissos;
  const totalAtual = abaAtiva === 'despesa' ? totalDespesas : totalCompromissos;

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

        {/* FILTRO PERÍODO */}
        <div className="periodo-controls">
          <button className={`btn ${periodo === 'semana' ? 'btn-primary' : ''}`} onClick={() => setPeriodo('semana')}>Semana</button>
          <button className={`btn ${periodo === 'mes' ? 'btn-primary' : ''}`} onClick={() => setPeriodo('mes')}>Mês</button>
          <button className={`btn ${periodo === 'tudo' ? 'btn-primary' : ''}`} onClick={() => setPeriodo('tudo')}>Tudo</button>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={salvar} className="card financeiro-form">
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="despesa">Despesa</option>
            <option value="compromisso">Compromisso</option>
          </select>

          <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
            <option value="">Categoria</option>
            {categorias
              .filter(c => c.tipo === tipo)
              .map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
          </select>

          <button type="button" className="btn" onClick={criarCategoria}>
            + Categoria
          </button>

          <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} required />
          <input type="number" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} required />
          <input type="date" value={data} onChange={e => setData(e.target.value)} required />
          <input placeholder="Observação" value={observacao} onChange={e => setObservacao(e.target.value)} />

          <button className="btn btn-primary">Salvar</button>
        </form>

        {/* TABS */}
        <div className="tabs">
          <button
            className={abaAtiva === 'despesa' ? 'tab active' : 'tab'}
            onClick={() => setAbaAtiva('despesa')}
          >
            Despesas
          </button>
          <button
            className={abaAtiva === 'compromisso' ? 'tab active' : 'tab'}
            onClick={() => setAbaAtiva('compromisso')}
          >
            Compromissos
          </button>
        </div>

        {/* LISTA */}
        <div className="card">
          <h2>{abaAtiva === 'despesa' ? 'Despesas' : 'Compromissos'}</h2>
          <p><strong>Total:</strong> R$ {totalAtual.toFixed(2)}</p>

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
                {listaAtual.map(m => (
                  <tr key={m.id}>
                    <td>{m.categoria_nome}</td>
                    <td>{m.descricao || '-'}</td>
                    <td>{m.observacao || '-'}</td>
                    <td>R$ {Number(m.valor).toFixed(2)}</td>
                    <td>{m.data ? new Date(m.data).toLocaleDateString() : '-'}</td>
                    <td>{m.status === 'pago' ? 'Pago' : 'Pendente'}</td>
                    <td className="acoes-cell">
                      {abaAtiva === 'compromisso' && m.status !== 'pago' && (
                        <button className="btn" onClick={() => marcarPago(m.id)}>
                          Marcar pago
                        </button>
                      )}
                      <button className="btn btn-danger" onClick={() => remover(m.id)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
                {listaAtual.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-cell">Nenhum registro</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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