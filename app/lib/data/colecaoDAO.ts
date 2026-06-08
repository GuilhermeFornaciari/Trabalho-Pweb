"use server";

import { stringify } from "querystring";
import PrismaSingleton from "../prisma/PrismaSingleton";

type LivroColecao = {
  id: number;
  posicao: number;
};

export async function colecaoCreate(nome: string, livros: LivroColecao[]) {
  const prisma = PrismaSingleton.getInstance().prismaClient;

  const colecao = await prisma.colecao.create({
    data: {
      nome,
    },
  });

  await Promise.all(
    livros.map((livro) =>
      prisma.livro.update({
        where: { id: livro.id },
        data: {
          colecaoId: colecao.id,
          posicao_colecao: livro.posicao,
        },
      })
    )
  );

  return colecao;
}



export async function colecaoId(id: number) {
  const prisma = PrismaSingleton.getInstance().prismaClient.colecao;

  return prisma.findUnique({
    where: { id },
    include: {
      livros: {
        orderBy: {
          posicao_colecao: "asc",
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
  

export async function deleteColecao(id: number) {
  
  const prisma = PrismaSingleton.getInstance().prismaClient;
  return prisma.colecao.delete({
    where: {
      id,
    },
  });
}