import { useState } from 'react'
import { criarEntradaManual } from '../../api/financeiro'
import { useNavigate } from 'react-router-dom'
import './CriarOrdem.css'

export default function EntradaRapida() {

  const navigate = useNavigate()

  const [valor, setValor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function salvar() {

    if (!valor) {
      alert('Informe o valor')
      return
    }

    try {

      setSalvando(true)

      await criarEntradaManual({
        valor: Number(valor),
        descricao
      })

      navigate('/ordens')

    } catch {

      alert('Erro ao registrar entrada')

    } finally {

      setSalvando(false)

    }

  }

  return (

    <div className="page">

      <div className="form-container">

        <h1 className="form-title">Entrada Rápida</h1>

        <div className="card">

          <label>Valor</label>

          <input
            type="number"
            className="input-full"
            value={valor}
            onChange={e => setValor(e.target.value)}
          />

          <label>Descrição</label>

          <input
            className="input-full"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            placeholder="Ex: venda balcão"
          />

        </div>

        <div className="form-actions">

          <button
            type="button"
            onClick={() => navigate('/ordens')}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            disabled={salvando}
            onClick={salvar}
          >
            {salvando ? 'Salvando...' : 'Registrar Entrada'}
          </button>

        </div>

      </div>

    </div>

  )

}