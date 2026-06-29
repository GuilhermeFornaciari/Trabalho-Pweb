import PrismaSingleton from "@/lib/prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function StatsAdmin() {
  const agora = new Date();
  const seteDiasAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
  const quatorzeDiasAtras = new Date(agora.getTime() - 14 * 24 * 60 * 60 * 1000);

  const obterMetricas = async (
    model: any,
    campoData?: string 
  ) => {
    const total = await model.count();

    if (!campoData) {
      return { total, crescimentoSemanal: 0 };
    }

    const destaSemana = await model.count({
      where: {
        [campoData]: {
          gte: seteDiasAtras,
        },
      },
    });

    const semanaPassada = await model.count({
      where: {
        [campoData]: {
          gte: quatorzeDiasAtras,
          lt: seteDiasAtras,
        },
      },
    });

    const crescimentoSemanal =
      semanaPassada > 0
        ? Math.round(((destaSemana - semanaPassada) / semanaPassada) * 100)
        : destaSemana * 100;

    return {
      total,
      crescimentoSemanal,
    };
  };

  const [usuarios, resenhas, comentarios, curtidas] = await Promise.all([
    obterMetricas(prisma.user), 
    obterMetricas(prisma.postagem, "data"),
    obterMetricas(prisma.comentario, "data"), 
    obterMetricas(prisma.curtida), 
  ]);

  // Ranking de livros
  const livrosMaisLidosRaw = await prisma.biblioteca.groupBy({
    by: ["livroId"],
    where: {
      status: "LIDO",
    },
    _count: {
      livroId: true,
    },
    orderBy: {
      _count: {
        livroId: "desc",
      },
    },
    take: 5,
  });

  const livrosInfo = await prisma.livro.findMany({
    where: {
      id: {
        in: livrosMaisLidosRaw.map((l) => l.livroId),
      },
    },
    select: {
      id: true,
      titulo: true,
      genero: true,
    },
  });

  const mapaLivros = new Map(
    livrosInfo.map((l) => [l.id, l])
  );

  const rankingLivros = livrosMaisLidosRaw.map((item) => ({
    id: item.livroId,
    titulo: mapaLivros.get(item.livroId)?.titulo ?? "Desconhecido",
    genero: mapaLivros.get(item.livroId)?.genero ?? "",
    totalLeitores: item._count.livroId,
  }));

  // Ranking de coleções
  const colecoes = await prisma.colecao.findMany({
    include: {
      livros: {
        include: {
          _count: {
            select: {
              bibliotecas: {
                where: {
                  status: "LIDO",
                },
              },
            },
          },
        },
      },
    },
  });

  const rankingColecoes = colecoes
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      totalLivrosLidos: c.livros.reduce(
        (acc, livro) => acc + livro._count.bibliotecas,
        0
      ),
    }))
    .sort((a, b) => b.totalLivrosLidos - a.totalLivrosLidos)
    .slice(0, 5);

  return {
    usuarios,
    resenhas, 
    comentarios,
    curtidas,
    rankingLivros,
    rankingColecoes,
  };
}