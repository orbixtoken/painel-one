import { useEffect, useState, useMemo } from 'react'
import { listarMovimentos } from '../../api/financeiro'
import { useNavigate } from 'react-router-dom'

import './FinanceiroPage.css'

export default function FinanceiroPage() {

  const navigate = useNavigate()

  const [movimentos, setMovimentos] = useState([])
  const [filtroPeriodo, setFiltroPeriodo] = useState('semana')

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {

    const data = await listarMovimentos()
    setMovimentos(data)

  }

  function limparDescricao(texto) {

    if (!texto) return ''

    return texto
      .replace(/DESPESA_ID:\d+/g, '')
      .replace(/ENTRADA_ID:\d+/g, '')
      .trim()

  }

  function filtrarPorPeriodo(m) {

    if (filtroPeriodo === 'tudo') return true

    const hoje = new Date()
    const dataMov = new Date(m.criado_em)

    if (filtroPeriodo === 'semana') {

      const seteDiasAtras = new Date()
      seteDiasAtras.setDate(hoje.getDate() - 7)

      return dataMov >= seteDiasAtras

    }

    if (filtroPeriodo === 'mes') {

      return (
        dataMov.getMonth() === hoje.getMonth() &&
        dataMov.getFullYear() === hoje.getFullYear()
      )

    }

    return true

  }

  const movimentosFiltrados = useMemo(() => {
    return movimentos.filter(filtrarPorPeriodo)
  }, [movimentos, filtroPeriodo])

  const resumo = useMemo(() => {

    let entradas = 0
    let despesas = 0
    let estornos = 0

    for (const m of movimentosFiltrados) {

      if (m.tipo === 'entrada') entradas += Number(m.valor)
      if (m.tipo === 'despesa') despesas += Number(m.valor)
      if (m.tipo === 'estorno') estornos += Number(m.valor)

    }

    return {
      entradas,
      despesas,
      estornos,
      saldo: entradas - despesas - estornos
    }

  }, [movimentosFiltrados])

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
            className="btn"
            onClick={() => setFiltroPeriodo('tudo')}
          >
            Tudo
          </button>

        </div>

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

              {movimentosFiltrados.map((m) => {

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

              {movimentosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-cell">
                    Nenhum registro encontrado
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )

}