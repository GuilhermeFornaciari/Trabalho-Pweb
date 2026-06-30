import PrismaSingleton from "../prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function buscarPostagensFeed(
  pagina: number, 
  filtro: string, 
  usuarioId?: string, 
  limite = 10
) {
  
  let whereClause: any = {};

  if (filtro === "Amigos" && usuarioId) {
    const amizades = await prisma.amigos.findMany({
      where: {
        OR: [
          { amigo1Id: usuarioId },
          { amigo2Id: usuarioId }
        ]
      }
    });

    const listaIdsAmigos = amizades.map(amizade => 
      amizade.amigo1Id === usuarioId ? amizade.amigo2Id : amizade.amigo1Id
    );

    whereClause = {
      usuarioId: {
        in: listaIdsAmigos
      }
    };
  }

  const [dados, total] = await Promise.all([
    prisma.postagem.findMany({
      where: whereClause, 
      orderBy: {
        data: "desc", 
      },
      skip: (pagina - 1) * limite,
      take: limite,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            username: true,
            foto: true,
          },
        },
        livro: {
          select: {
            id: true,
            titulo: true,
            capa: true,
            paginas: true,
            autores: {
              include: {
                autor: {
                  select: {
                    nome: true
                  }
                }
              }
            }
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
    }),

    prisma.postagem.count({ where: whereClause }),
  ]);

  return {
    resenhas: dados,
    total,
    totalPaginas: Math.ceil(total / limite),
    paginaAtual: pagina,
  };
}