import { colecaoCreate } from "@/lib/data/colecaoDAO";

type LivroColecao = {
  id: number;
  posicao: number;
};


export async function colecao( dado: string, livros: LivroColecao[]) {
  const colection = await colecaoCreate(dado, livros);

  if (!colection) {
    throw new Error("Erro criar coleção")
  }

  return colection;
}



