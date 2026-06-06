import { findAutoresPorNome } from "@/lib/data/autorDAO";

export async function getAutores(nome: string) {
  try{
    const autores = findAutoresPorNome(nome);
    if(!autores) {
      return {status: 404, message: `Nenhum resultado encontrado para ${nome}`}
    }
    return autores;
  } catch(e) {
    return {message: 'Não foi possível buscar autores.'};
  }
}