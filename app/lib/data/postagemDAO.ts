import { Postagem } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";


const prisma = PrismaSingleton.getInstance().prismaClient;


export async function createResenha(resenha: Omit<Postagem, "id">) {
  return prisma.postagem.create({
    data: resenha,
  });
}




export async function livrosResenhasRecentes(livroId: number, pagina: number, limite = 10) {
  const where = {
    livroId,
    nota: {
      not: null,
    },
  };

  const [dados, total] = await Promise.all([
    prisma.postagem.findMany({
      where,
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
        comentarios: {
          include: {
            curtidas: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                username: true,
                foto: true,
              },
            },
          },
          orderBy: {
            data: "asc",
          },
        },
      },
      orderBy: {
        data: "desc",
      },
      skip: (pagina - 1) * limite,
      take: limite,
    }),

    prisma.postagem.count({
      where,
    }),
  ]);

  return {
    resenhas: dados, 
    total,
    totalPaginas: Math.ceil(total / limite),
    paginaAtual: pagina,
  };
}