import { useEffect, useState, useMemo } from 'react'
import api from '../../lib/api'
import './FinanceiroRelatorioPage.css'

export default function FinanceiroRelatorioPage() {

  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [periodo, setPeriodo] = useState('mes')

  useEffect(() => {
    carregar()
  }, [periodo])

  async function carregar() {

    try {

      const { data } = await api.get(`/financeiro/relatorio?periodo=${periodo}`)
      setDados(data)

    } catch {

      alert('Erro ao carregar relatório')

    } finally {

      setCarregando(false)

    }

  }

  /* =========================
     PROTEÇÃO DE DADOS
  ========================= */

  const totais = dados?.totais || {}
  const entradas_origem = dados?.entradas_origem || []
  const despesas_origem = dados?.despesas_origem || []
  const linha_tempo = dados?.linha_tempo || []

  const totalEntradas = totais.entradas || 0
  const totalDespesas = totais.despesas || 0
  const saldo = totais.resultado || 0
  const margem = totais.margem ? totais.margem.toFixed(1) : 0

  const insight = useMemo(() => {

    if (saldo > 0) {
      return 'A empresa está operando com lucro neste período.'
    }

    if (saldo < 0) {
      return 'As despesas superaram as entradas neste período.'
    }

    return 'Entradas e despesas estão equilibradas.'

  }, [saldo])

  function imprimir() {
    window.print()
  }

  function exportarCSV() {

    const linhas = [['Data','Tipo','Descrição','Valor']]

    linha_tempo.forEach(l => {

      linhas.push([
        new Date(l.criado_em).toLocaleDateString(),
        l.tipo,
        l.descricao,
        Number(l.valor).toFixed(2)
      ])

    })

    const csvContent = linhas.map(e => e.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "relatorio_financeiro.csv")
    link.click()

  }

  function limparDescricao(desc) {

    if (!desc) return '-'

    return desc
      .replace(/DESPESA_ID:\d+\s*/gi, '')
      .replace(/DESPESA_ID:\d+/gi, '')

  }

  if (carregando) {
    return <p>Carregando relatório...</p>
  }

  return (

    <div className="page">

      <div className="page-header">
        <h1>Relatório Financeiro</h1>
        <p>Análise financeira da empresa</p>
      </div>

      {/* FILTROS */}

      <div className="relatorio-filtros">

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
          className={`btn ${periodo === 'ano' ? 'btn-primary' : ''}`}
          onClick={() => setPeriodo('ano')}
        >
          Ano
        </button>

      </div>

      {/* CARDS */}

      <div className="relatorio-cards">

        <div className="card entrada">
          <h3>Entradas</h3>
          <strong>R$ {totalEntradas.toFixed(2)}</strong>
        </div>

        <div className="card despesa">
          <h3>Despesas</h3>
          <strong>R$ {totalDespesas.toFixed(2)}</strong>
        </div>

        <div className="card saldo">
          <h3>Resultado</h3>
          <strong>R$ {saldo.toFixed(2)}</strong>
        </div>

        <div className="card margem">
          <h3>Margem</h3>
          <strong>{margem}%</strong>
        </div>

      </div>

      {/* INSIGHT */}

      <div className="card relatorio-insights">

        <h3>Insight financeiro</h3>

        <p>{insight}</p>

        <p>
          Entradas totais: <strong>R$ {totalEntradas.toFixed(2)}</strong>
        </p>

        <p>
          Despesas totais: <strong>R$ {totalDespesas.toFixed(2)}</strong>
        </p>

        <p>
          Resultado: <strong>R$ {saldo.toFixed(2)}</strong>
        </p>

      </div>

      {/* ENTRADAS */}

      <div className="card">

        <h3>Origem das Entradas</h3>

        <div className="table-wrapper">
          <table className="responsive-table">

            <thead>
              <tr>
                <th>Data</th>
                <th>Origem</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {entradas_origem.map((e,i) => (

                <tr key={i}>

                  <td>
                    {e.data ? new Date(e.data).toLocaleDateString() : '-'}
                  </td>

                  <td>
                    {limparDescricao(e.descricao)}
                  </td>

                  <td className="valor-entrada">
                    R$ {Number(e.total).toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>

      </div>

      {/* DESPESAS */}

      <div className="card">

        <h3>Destino das Despesas</h3>

        <div className="table-wrapper">
          <table className="responsive-table">

            <thead>
              <tr>
                <th>Data</th>
                <th>Categoria</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              {despesas_origem.map((d,i) => (

                <tr key={i}>

                  <td>
                    {d.data ? new Date(d.data).toLocaleDateString() : '-'}
                  </td>

                  <td>
                    {limparDescricao(d.descricao)}
                  </td>

                  <td className="valor-saida">
                    R$ {Number(d.total).toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>

      </div>

      {/* LINHA DO TEMPO */}

      <div className="card">

        <h3>Linha do Tempo Financeira</h3>

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

              {linha_tempo.map((l,i) => (

                <tr key={i}>

                  <td>
                    {new Date(l.criado_em).toLocaleDateString()}
                  </td>

                  <td>{l.tipo}</td>

                  <td>{limparDescricao(l.descricao)}</td>

                  <td className={l.tipo === 'despesa' ? 'valor-saida' : 'valor-entrada'}>
                    R$ {Number(l.valor).toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>

      </div>

      <div className="relatorio-acoes">

        <button className="btn" onClick={imprimir}>
          Imprimir
        </button>

        <button className="btn" onClick={exportarCSV}>
          Exportar CSV
        </button>

      </div>

    </div>

  )

}