import { useEffect, useState, useMemo } from 'react'
import api from '../../lib/api'
import './FinanceiroExtraPage.css'

export default function FinanceiroExtraPage() {

  const [movimentacoes, setMovimentacoes] = useState([])
  const [categorias, setCategorias] = useState([])

  const [categoriaId, setCategoriaId] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [data, setData] = useState('')
  const [observacao, setObservacao] = useState('')
  const [periodo, setPeriodo] = useState('mes')

  useEffect(() => {
    carregarTudo()
  }, [periodo])

  async function carregarTudo() {

    const [mov, cat] = await Promise.all([
      api.get(`/financeiro-extra?periodo=${periodo}`),
      api.get('/financeiro-extra/categorias')
    ])

    setMovimentacoes(mov.data)
    setCategorias(cat.data)

  }

  async function salvar(e) {

    e.preventDefault()

    await api.post('/financeiro-extra', {
      tipo: 'despesa',
      categoria_id: categoriaId,
      descricao,
      valor,
      data_lancamento: data,
      observacao
    })

    limparFormulario()
    carregarTudo()

  }

  function limparFormulario() {

    setDescricao('')
    setValor('')
    setData('')
    setObservacao('')

  }

  async function criarCategoria() {

    const nome = prompt('Nome da categoria:')
    if (!nome) return

    await api.post('/financeiro-extra/categorias', {
      nome,
      tipo: 'despesa'
    })

    carregarTudo()

  }

  const despesas = useMemo(
    () => movimentacoes.filter(m => m.tipo === 'despesa'),
    [movimentacoes]
  )

  const totalDespesas = despesas.reduce(
    (t, m) => t + Number(m.valor),
    0
  )

  const despesasMes = despesas.filter(d => {

    const data = new Date(d.data)
    const hoje = new Date()

    return (
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    )

  })

  const totalMes = despesasMes.reduce(
    (t, m) => t + Number(m.valor),
    0
  )

  const ultimaDespesa = despesas.length > 0 ? despesas[0] : null

  return (

    <div className="page">

      <div className="financeiro-extra-container">

        <h1>Despesas</h1>

        {/* DASHBOARD */}

        <div className="resumo-grid">

          <Resumo
            titulo="Total de despesas"
            valor={totalDespesas}
          />

          <Resumo
            titulo="Despesas do mês"
            valor={totalMes}
          />

          <Resumo
            titulo="Última despesa"
            valor={ultimaDespesa ? Number(ultimaDespesa.valor) : 0}
          />

        </div>

        {/* FILTRO */}

        <div className="periodo-controls">

          <button
            className={`btn ${periodo === 'semana' ? 'btn-primary' : ''}`}
            onClick={() => setPeriodo('semana')}
          >
            Semana
          </button>

          <button
            className={`btn ${periodo === 'mes' ? 'btn-primary' : ''}`}
            onClick={() => setPeriodo('mes')}
          >
            Mês
          </button>

          <button
            className={`btn ${periodo === 'tudo' ? 'btn-primary' : ''}`}
            onClick={() => setPeriodo('tudo')}
          >
            Tudo
          </button>

        </div>

        {/* FORMULÁRIO */}

        <form onSubmit={salvar} className="card financeiro-form">

          <select
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
            required
          >

            <option value="">Categoria</option>

            {categorias
              .filter(c => c.tipo === 'despesa')
              .map(c => (

                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>

              ))}

          </select>

          <button
            type="button"
            className="btn"
            onClick={criarCategoria}
          >
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
            Registrar Despesa
          </button>

        </form>

        {/* LISTA */}

        <div className="card">

          <h2>Despesas registradas</h2>

          <p>
            <strong>Total:</strong> R$ {totalDespesas.toFixed(2)}
          </p>

          <div className="table-wrapper">

            <table className="responsive-table">

              <thead>

                <tr>
                  <th>Categoria</th>
                  <th>Descrição</th>
                  <th>Obs.</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>

              </thead>

              <tbody>

                {despesas.map(m => (

                  <tr key={m.id}>

                    <td>{m.categoria_nome}</td>
                    <td>{m.descricao || '-'}</td>
                    <td>{m.observacao || '-'}</td>
                    <td className="valor-saida">
                      R$ {Number(m.valor).toFixed(2)}
                    </td>

                    <td>
                      {m.data
                        ? new Date(m.data).toLocaleDateString()
                        : '-'}
                    </td>

                  </tr>

                ))}

                {despesas.length === 0 && (

                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Nenhum registro
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  )

}

function Resumo({ titulo, valor }) {

  return (

    <div className="resumo-card">

      <strong>{titulo}</strong>

      <div>
        R$ {Number(valor).toFixed(2)}
      </div>

    </div>

  )

}