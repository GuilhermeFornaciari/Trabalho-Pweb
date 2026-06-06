"use server"

import { colecaoCreate } from "@/lib/data/colecaoDAO";
import { Colecao } from "@/lib/prisma/generated/client";

type LivroColecao = {
  id: number;
  posicao: number;
};


export async function colecao( dado: Colecao, livros: LivroColecao[]) {
  const colection = await colecaoCreate(dado, livros);

  if (!colection) {
    throw new Error("Erro criar coleção")
  }

  return colection;
}



