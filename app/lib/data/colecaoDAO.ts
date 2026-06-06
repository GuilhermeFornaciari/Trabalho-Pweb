"use server";

import { Colecao } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";

type LivroColecao = {
  id: number;
  posicao: number;
};

export async function colecaoCreate( data: Colecao, livros: LivroColecao[] ){

    const prisma = PrismaSingleton.getInstance().prismaClient.colecao;

    return await prisma.create({
      data: {
        nome: data.nome,
        livros: {
          create: livros.map((livro) => ({
            livroId: livro.id,
            posicao: livro.posicao,
          })),
        },
      },
    });
}

