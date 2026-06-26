import PrismaSingleton from "../prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;
export async function buscarPostagensFeed() {
  return await prisma.postagem.findMany({
    orderBy: {
      data: "desc", // Mostra as postagens mais recentes primeiro
    },
    include: {
      // Traz os dados de quem postou
      usuario: {
        select: {
          id: true,
          nome: true,
          username: true,
          foto: true,
        },
      },
      // Traz as informações do livro comentado ou lido
      livro: {
        select: {
          id: true,
          titulo: true,
          capa: true,
          paginas: true,
        },
      },
      // Contabiliza ou traz as curtidas
      curtidas: true,
      // Traw os comentários já com os dados de quem comentou
      comentarios: {
        include: {
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
          data: "asc", // Comentários antigos primeiro (ordem cronológica de conversa)
        },
      },
    },
  });
}