import api from '../lib/api'

export async function listarLancamentos(periodo){

  const { data } = await api.get(
    `/lancamentos-futuros?periodo=${periodo}`
  )

  return data

}

export async function criarLancamento(payload){

  const { data } = await api.post(
    '/lancamentos-futuros',
    payload
  )

  return data

}

export async function realizarLancamento(id){

  const { data } = await api.post(
    `/lancamentos-futuros/${id}/realizar`
  )

  return data

}