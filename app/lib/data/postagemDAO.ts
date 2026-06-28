import { Postagem } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";


const prisma = PrismaSingleton.getInstance().prismaClient;


export async function createResenha(resenha: Omit<Postagem, "id">) {
  return prisma.postagem.create({
    data: resenha,
  });
}

export async function createProgresso(progresso: Omit<Postagem, "id">) {
  return prisma.postagem.create({
    data: progresso,
  })
}

export async function livrosResenhasRecentes(livroId: number){
  const dados = await prisma.postagem.findMany({
    where: {
      livroId,
      nota: {
        not: null,
      },
    },
    include: {
      usuario: {
        select: {
          id: true,
          nome: true,
          username: true,
          foto: true,
        },
      },
      curtidas: true,
    },
    orderBy: {
      data: "desc",
    },
  });

  console.dir(dados[0].curtidas, { depth: null });

  return dados;
}
