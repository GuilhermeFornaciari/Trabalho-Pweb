import { stringify } from "querystring";
import PrismaSingleton from "../prisma/PrismaSingleton";

type LivroColecao = {
  id: number;
  posicao: number;
};

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function colecaoCreate(nome: string, livros: LivroColecao[]) {

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
  return await prisma.colecao.findUnique({
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
  const ret = await prisma.colecao.findMany({
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
  return await prisma.colecao.delete({
    where: {
      id,
    },
  });
}

export async function updateColecao(
  id: number,
  nome: string,
  livros: { id: number; posicao: number }[]
) {
  return await prisma.$transaction(async (tx) => {
    const colecao = await tx.colecao.update({
      where: { id },
      data: { nome }
    });

    await tx.livro.updateMany({
      where: { colecaoId: id },
      data: {
        colecaoId: null,
        posicao_colecao: null
      }
    });

    for (const livro of livros) {
      await tx.livro.update({
        where: { id: livro.id },
        data: {
          colecaoId: id,
          posicao_colecao: livro.posicao
        }
      });
    }

    return colecao;
  });
}