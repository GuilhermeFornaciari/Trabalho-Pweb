"use server";

import { Colecao } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";

type LivroColecao = {
  id: number;
  posicao: number;
};

export async function colecaoCreate( data: string, livros: LivroColecao[] ){

    const prisma = PrismaSingleton.getInstance().prismaClient.colecao;

    return await prisma.create({
      data: {
        nome: data,
        livros: {
          create: livros.map((livro) => ({
            livroId: livro.id,
            posicao: livro.posicao,
          })),
        },
      },
    });
}

