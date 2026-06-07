"use server";

import { stringify } from "querystring";
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

export async function colecaoId(id: number) {
  const prisma = PrismaSingleton.getInstance().prismaClient.colecao;

  return await prisma.findUnique({
    where: { id },
    include: {
      livros: {
        include: {
          livro: true,
        },
        orderBy: {
          posicao: "asc",
        },
      },
    },
  });
}

export async function searchColecoes( nome: string ){

    const prisma = PrismaSingleton.getInstance().prismaClient.colecao;

    const ret = await prisma.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive"
        }
      },
      include: {
        livros: true
      }
    });


    console.log(JSON.stringify(ret))

    if(ret.length === 0){
      console.log("ERRO no id da coleção");
    }

    return ret;
}


