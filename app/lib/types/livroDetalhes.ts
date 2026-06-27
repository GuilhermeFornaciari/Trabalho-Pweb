import { Biblioteca, Colecao, Livro } from "../prisma/generated/client"

export type LivroDetalhes = Livro & {
  autores: Array<{id: number, nome: string}> ;
  colecao: Colecao;
  biblioteca: Biblioteca | null;
}