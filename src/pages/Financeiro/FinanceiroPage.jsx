import { useEffect, useState } from 'react'
import { relatorioFinanceiro } from '../../api/financeiro'
import { useNavigate } from 'react-router-dom'

import './FinanceiroPage.css'

export default function FinanceiroPage() {

  const navigate = useNavigate()

  const [movimentos, setMovimentos] = useState([])
  const [filtroPeriodo, setFiltroPeriodo] = useState('semana')

  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1)
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())

  const [resumo, setResumo] = useState({
    entradas: 0,
    despesas: 0,
    estornos: 0,
    saldo: 0
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregar()
  }, [filtroPeriodo, mesSelecionado, anoSelecionado])

  async function carregar() {

    try {

      setLoading(true)

      let params = {}

      if (filtroPeriodo === 'mes') {
        params = {
          periodo: 'mes',
          mes: mesSelecionado,
          ano: anoSelecionado
        }
      } else if (filtroPeriodo === 'semana') {
        params = { periodo: 'semana' }
      } else if (filtroPeriodo === 'ano') {
        params = { periodo: 'ano', ano: anoSelecionado }
      }

      const relatorio = await relatorioFinanceiro(params)

      setMovimentos(relatorio.linha_tempo || [])

      setResumo({
        entradas: relatorio.totais?.entradas || 0,
        despesas: relatorio.totais?.despesas || 0,
        estornos: relatorio.totais?.estornos || 0,
        saldo: relatorio.saldo?.saldo_final || 0
      })

    } catch (err) {
      console.error('Erro ao carregar financeiro:', err)
    } finally {
      setLoading(false)
    }

  }

  function limparDescricao(texto) {

    if (!texto) return ''

    return texto
      .replace(/DESPESA_ID:\d+/g, '')
      .replace(/ENTRADA_ID:\d+/g, '')
      .trim()

  }

  function imprimir() {
    window.print()
  }

  function abrirRelatorio() {
    navigate('/financeiro/relatorio')
  }

  return (

    <div className="page">

      <div className="page-header">
        <h1>Financeiro</h1>
        <p>Fluxo financeiro da empresa</p>
      </div>

      <div className="financeiro-controls">

        <div className="controls-group">

          <button
            className={`btn ${filtroPeriodo === 'semana' ? 'btn-primary' : ''}`}
            onClick={() => setFiltroPeriodo('semana')}
          >
            Semana
          </button>

          <button
            className={`btn ${filtroPeriodo === 'mes' ? 'btn-primary' : ''}`}
            onClick={() => setFiltroPeriodo('mes')}
          >
            Mês
          </button>

          <button
            className={`btn ${filtroPeriodo === 'ano' ? 'btn-primary' : ''}`}
            onClick={() => setFiltroPeriodo('ano')}
          >
            Ano
          </button>

          <button
            className={`btn ${filtroPeriodo === 'tudo' ? 'btn-primary' : ''}`}
            onClick={() => setFiltroPeriodo('tudo')}
          >
            Tudo
          </button>

        </div>

        {filtroPeriodo === 'mes' && (

          <div className="controls-group">

            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            />

          </div>

        )}

        <div className="controls-summary">

          <div className="finance-summary">

            <span className="entrada">
              Entradas: R$ {resumo.entradas.toFixed(2)}
            </span>

            <span className="despesa">
              Despesas: R$ {resumo.despesas.toFixed(2)}
            </span>

            <span className="saldo">
              Saldo: R$ {resumo.saldo.toFixed(2)}
            </span>

          </div>

          <button
            className="btn btn-primary"
            onClick={abrirRelatorio}
          >
            Relatórios
          </button>

          <button
            className="btn"
            onClick={imprimir}
          >
            Imprimir
          </button>

        </div>

      </div>

      <div className="page-content">

        {loading && <p>Carregando...</p>}

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

              {movimentos.map((m) => {

                const valor =
                  m.tipo === 'despesa' || m.tipo === 'estorno'
                    ? -Number(m.valor)
                    : Number(m.valor)

                const descricaoLimpa = limparDescricao(m.descricao)

                return (

                  <tr key={m.id}>

                    <td>
                      {new Date(m.criado_em).toLocaleString()}
                    </td>

                    <td className="tipo-col">
                      {m.tipo}
                    </td>

                    <td>
                      {descricaoLimpa}
                    </td>

                    <td className={valor < 0 ? 'valor-saida' : 'valor-entrada'}>
                      R$ {valor.toFixed(2)}
                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}