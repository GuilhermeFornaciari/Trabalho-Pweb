import { colecaoCreate, colecaoId } from "@/lib/data/colecaoDAO";
import { stringify } from "querystring";

type LivroColecao = {
  id: number;
  posicao: number;
};


export async function colecao( dado: string, livros: LivroColecao[]) {
  const colection = await colecaoCreate(dado, livros);

  console.log(stringify(colection))

  if (!colection) {
    throw new Error("Erro criar coleção")
  }

  return colection;
}


export async function getById(id: number) {
  try {
    const res = await colecaoId(id);
    if(res === null) {
      return {status: 404, message: 'colecao não encontrado'}
    }
    return res;
  } catch(e) {
    return {status:500, message: 'Não foi possível buscar esta colecao.'}
  }
}
