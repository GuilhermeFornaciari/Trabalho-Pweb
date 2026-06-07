import { colecaoCreate } from "@/lib/data/colecaoDAO";
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



