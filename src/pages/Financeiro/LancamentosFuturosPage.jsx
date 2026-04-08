import { useEffect, useState, useMemo } from 'react'
import api from '../../lib/api'
import './LancamentosFuturosPage.css'

export default function LancamentosFuturosPage() {

  const [lancamentos,setLancamentos] = useState([])
  const [categorias,setCategorias] = useState([])

  const [tipo,setTipo] = useState('despesa')
  const [categoriaId,setCategoriaId] = useState('')
  const [descricao,setDescricao] = useState('')
  const [valor,setValor] = useState('')
  const [data,setData] = useState('')

  const [periodo,setPeriodo] = useState('mes')

  const [filtroTipo,setFiltroTipo] = useState('todos')


  useEffect(()=>{

    carregar()

  },[periodo])


  async function carregar(){

    try{

      const [l,c] = await Promise.all([

        api.get(`/lancamentos-futuros?periodo=${periodo}`),
        api.get('/financeiro-extra/categorias')

      ])

      setLancamentos(l.data || [])
      setCategorias(c.data || [])

    }catch(err){

      console.error('Erro ao carregar lançamentos futuros',err)

    }

  }


  async function salvar(e){

    e.preventDefault()

    try{

      await api.post('/lancamentos-futuros',{

        tipo,
        categoria_id: categoriaId || null,
        descricao,
        valor,
        data_prevista:data

      })

      limpar()
      carregar()

    }catch(err){

      console.error('Erro ao salvar lançamento',err)

    }

  }


  function limpar(){

    setDescricao('')
    setValor('')
    setData('')
    setCategoriaId('')

  }


  async function criarCategoria(){

    const nome = prompt('Nome da categoria:')

    if(!nome) return

    try{

      await api.post('/financeiro-extra/categorias',{
        nome,
        tipo
      })

      carregar()

    }catch(err){

      console.error('Erro ao criar categoria',err)

    }

  }


  async function realizar(id,lancamentoTipo){

    const mensagem = lancamentoTipo === 'entrada'
      ? 'Confirmar recebimento desta entrada?'
      : 'Confirmar pagamento desta despesa?'

    if(!window.confirm(mensagem)) return

    try{

      await api.post(`/lancamentos-futuros/${id}/realizar`)
      carregar()

    }catch(err){

      console.error('Erro ao realizar lançamento',err)

    }

  }
   async function deletar(id){

  if(!window.confirm('Deseja realmente excluir este lançamento?')) return

  try{

    await api.delete(`/lancamentos-futuros/${id}`)
    carregar()

  }catch(err){

    console.error('Erro ao deletar lançamento',err)
    alert('Erro ao deletar lançamento')

  }

}


  /* =========================
     PROJEÇÃO FINANCEIRA
  ========================= */

  const entradasPrevistas = useMemo(()=>{

    return lancamentos
      .filter(l=>l.tipo === 'entrada')
      .reduce((t,l)=>t + Number(l.valor),0)

  },[lancamentos])


  const despesasPrevistas = useMemo(()=>{

    return lancamentos
      .filter(l=>l.tipo === 'despesa')
      .reduce((t,l)=>t + Number(l.valor),0)

  },[lancamentos])


  const saldoProjetado = entradasPrevistas - despesasPrevistas



  /* =========================
     CATEGORIAS DISPONÍVEIS
  ========================= */

  const categoriasDisponiveis = useMemo(()=>{

    return categorias.filter(c => {

      if(!c.tipo) return true
      if(c.tipo === tipo) return true
      if(tipo === 'entrada' && c.tipo === 'receita') return true

      return false

    })

  },[categorias,tipo])


  /* =========================
     FILTRO DE LISTA
  ========================= */

  const lancamentosFiltrados = useMemo(()=>{

    if(filtroTipo === 'todos') return lancamentos

    return lancamentos.filter(l => l.tipo === filtroTipo)

  },[lancamentos,filtroTipo])



  return (

    <div className="page">

      <div className="page-header">
        <h1>Lançamentos Futuros</h1>
        <p>Planejamento financeiro da empresa</p>
      </div>


      {/* CARDS */}

      <div className="resumo-grid">

        <Resumo
          titulo="Entradas previstas"
          valor={entradasPrevistas}
        />

        <Resumo
          titulo="Despesas previstas"
          valor={despesasPrevistas}
        />

        <Resumo
          titulo="Saldo projetado"
          valor={saldoProjetado}
        />

      </div>


      {/* FORMULÁRIO */}

      <form onSubmit={salvar} className="card financeiro-form">

        <select
          value={tipo}
          onChange={e=>setTipo(e.target.value)}
        >

          <option value="despesa">Despesa</option>
          <option value="entrada">Entrada</option>

        </select>


        <select
          value={categoriaId}
          onChange={e=>setCategoriaId(e.target.value)}
        >

          <option value="">
            Sem categoria
          </option>

          {categoriasDisponiveis.map(c=>(

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
          onChange={e=>setDescricao(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={e=>setValor(e.target.value)}
          required
        />

        <input
          type="date"
          value={data}
          onChange={e=>setData(e.target.value)}
          required
        />

        <button className="btn btn-primary">
          Salvar
        </button>

      </form>



      {/* FILTROS */}

      <div className="filtro-lancamentos">

        <button
          className={`btn ${filtroTipo === 'todos' ? 'btn-primary' : ''}`}
          onClick={()=>setFiltroTipo('todos')}
        >
          Todos
        </button>

        <button
          className={`btn ${filtroTipo === 'entrada' ? 'btn-primary' : ''}`}
          onClick={()=>setFiltroTipo('entrada')}
        >
          Entradas
        </button>

        <button
          className={`btn ${filtroTipo === 'despesa' ? 'btn-primary' : ''}`}
          onClick={()=>setFiltroTipo('despesa')}
        >
          Despesas
        </button>

      </div>



      {/* LISTA */}

      <div className="card">

        <h2>Lançamentos previstos</h2>

        <div className="table-wrapper">

          <table className="responsive-table">

            <thead>

              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th></th>
              </tr>

            </thead>

            <tbody>

              {lancamentosFiltrados.map(l=>(

                <tr key={l.id}>

                  <td>
                    {new Date(l.data_prevista)
                      .toLocaleDateString()}
                  </td>

                  <td>{l.tipo}</td>

                  <td>
                    {l.categoria_nome || '-'}
                  </td>

                  <td>{l.descricao}</td>

                  <td>
                    R$ {Number(l.valor).toFixed(2)}
                  </td>

                 <td className="acoes">

  <button
    className="btn"
    onClick={()=>realizar(l.id,l.tipo)}
  >
    {l.tipo === 'entrada' ? 'Recebido' : 'Pago'}
  </button>

  <button
    className="btn btn-danger"
    onClick={()=>deletar(l.id)}
  >
    Excluir
  </button>

</td>

                </tr>

              ))}

              {lancamentosFiltrados.length === 0 && (

                <tr>
                  <td colSpan="6" className="empty-cell">
                    Nenhum lançamento previsto
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


function Resumo({titulo,valor}){

  return(

    <div className="resumo-card">

      <strong>{titulo}</strong>

      <div>
        R$ {Number(valor).toFixed(2)}
      </div>

    </div>

  )

}