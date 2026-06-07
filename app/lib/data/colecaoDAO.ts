"use server";

import PrismaSingleton from "../prisma/PrismaSingleton";

type LivroColecao = {
  id: number;
  posicao: number;
};

export async function colecaoCreate( data: string, livros: LivroColecao[] ){

    const prisma = PrismaSingleton.getInstance().prismaClient.colecao;
    console.log(data) // nome da colecao
    console.log(livros) // id e posicao do livro

    return await prisma.create({
      data: {
        nome: data,
        livros: {
          create: livros.map((livro) => ({
            posicao: livro.posicao,
            livro: {
              connect: {
                id: livro.id,
              },
            },
          })),
        },
      },
    });
}

