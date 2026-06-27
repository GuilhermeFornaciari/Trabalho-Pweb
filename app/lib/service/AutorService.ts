import { findAutoresPorNome, findAutorPorId } from "@/lib/data/autorDAO";

export async function getAutores(nome: string) {
  try{
    const autores = findAutoresPorNome(nome);
    console.log(JSON.stringify(autores))
    if(!autores) {
      return {status: 404, message: `Nenhum resultado encontrado para ${nome}`}
    }
    return autores;
  } catch(e) {
    return {message: 'Não foi possível buscar autores.'};
  }
}


export async function getAutorId(id: number) {
  try{
    const autores = findAutorPorId(id);
    if(autores === null) {
      return {status: 404, message: `Nenhum resultado encontrado para ${id}`}
    }
    return autores;
  } catch(e) {
    return {message: 'Não foi possível buscar autores.'};
  }
}

