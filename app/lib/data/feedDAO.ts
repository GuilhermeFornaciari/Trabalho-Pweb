import PrismaSingleton from "../prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function buscarPostagensFeed(pagina: number, limite = 10) {
  const [dados, total] = await Promise.all([
    prisma.postagem.findMany({
      orderBy: {
        data: "desc", // Mostra as postagens mais recentes primeiro
      },
      skip: (pagina - 1) * limite,
      take: limite,
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
        // Traz APENAS as curtidas do Post Principal
        curtidas: true,
        
        // Traz os comentários já com os dados de quem comentou E as curtidas de cada um
        comentarios: {
          include: {
            // CRUCIAL: Traz as curtidas específicas deste comentário
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
            data: "asc", // Comentários antigos primeiro (ordem cronológica)
          },
        },
      },
    }),

    prisma.postagem.count(),
  ]);

  // Retorna o mesmo formato de objeto estruturado da outra listagem
  return {
    resenhas: dados, // Se preferir manter o padrão exato da opção A anterior
    total,
    totalPaginas: Math.ceil(total / limite),
    paginaAtual: pagina,
  };
}