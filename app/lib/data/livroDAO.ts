import Livro from "@/(entidades)/livro";
import PrismaSingleton from "@/lib/prisma/PrismaSingleton";
import { Session } from "next-auth";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function createLivro(livro: Livro) {
  const novoLivro = await prisma.livro.create({
    data: {
      titulo: livro.titulo,
      ano: livro.ano,
      genero: livro.genero,
      paginas: livro.paginas,
      capa: livro.capa,
      sinopse: livro.sinopse,
      autores: {
        create: livro.autores.map((id: number) => {
          return {
            autor: {
              connect: {
                id: id
              }
            }
          }
        })
      },
    },
    include: {
      autores: {
        include: {
          autor: true
        }
      }
    }
  });

  return {
    ...novoLivro,
    autores: novoLivro.autores.map(relacao => relacao.autor)
  };
}


export async function updateLivro(livro: Livro) {
  return prisma.livro.update({
    where: {
      id: livro.id,
    },
    data: {
      titulo: livro.titulo,
      ano: livro.ano,
      genero: livro.genero,
      paginas: livro.paginas,
      capa: livro.capa,
      sinopse: livro.sinopse,
      autores: {
        deleteMany: {}, 
        create: livro.autores.map((id: number) => ({
          autor: {
            connect: { id: id }
          }
        }))
      }
    },
  });
}

export async function deleteLivro(id: number, colecaoId: number | null){
  await prisma.livro.delete({
    where: { id }
  });

  const quantidade = await prisma.livro.count({
    where: {
      colecaoId
    }
  });

  if(quantidade === 0 && colecaoId === 0){
    await prisma.colecao.delete({
      where: { id: colecaoId }
    });
  }
}

export async function getLivroById(id: number, user: Session["user"]) {
  const livroPromise = prisma.livro.findUnique({
    where: { id },
    include: {
      colecao: true,
      autores: {
        include: {
          autor: true,
        },
      },
    },
  });

  const bibliotecaPromise = prisma.biblioteca.findUnique({
    where: {
      usuarioId_livroId: {
        usuarioId: user.id,
        livroId: id,
      },
    },
  });

  const [livro, biblioteca] = await Promise.all([
    livroPromise,
    bibliotecaPromise,
  ]);

  if (!livro) return null;
  
  return {
    ...livro,
    autores: livro.autores.map((a) => a.autor),
    biblioteca,
  };
}



export async function getLivros(valor: string, filtro: string) {
  let where = {};

  if (["titulo", "genero"].includes(filtro)) {
    where = {
      [filtro]: {
        contains: valor,
        mode: "insensitive",
      },
    };
  } else if (filtro === "ano") {
    where = { ano: Number(valor) };
  } else if (filtro === "autor") {
    where = {
      autores: {
        some: {
          autor: {
            nome: {
              contains: valor,
              mode: "insensitive",
            },
          },
        },
      },
    };
  }

  const livros = await prisma.livro.findMany({
    where,
    include: {
      autores: {
        include: {
          autor: true,
        },
      },
    },
  });

  return livros.map(livro => ({
    ...livro,
    autores: livro.autores
      .map(a => a.autor)
  }));
}

export async function getLivrosRecentes(quantidade: number){
  const livrosRecentes = await prisma.livro.findMany({
    include: {
      autores: {
        include: {
          autor: true,
        },
      },
    },
    orderBy:{
      createdAt: "desc"
    },
    take: quantidade
  })
  return livrosRecentes.map(livro => ({
    ...livro, 
    autores: livro.autores
      .map(a => a.autor)
  }));
}

export async function discussao(livroId: number) {
  const postagens = await prisma.postagem.findMany({
    where: {
      livroId,
      paginaAtual: {
        not: null,
      },
    },
    select: {
      paginaAtual: true,
      livro: {
        select: {
          paginas: true,
        },
      },
    },
  });

  const faixas = Array.from({ length: 21 }, (_, i) => ({
    porcentagem: i * 5,
    quantidade: 0,
  }));

  for (const postagem of postagens) {
    if (!postagem.livro.paginas || postagem.livro.paginas === 0) continue;
    const porcentagem = (postagem.paginaAtual! / postagem.livro.paginas) * 100;
    
    const indice = Math.min(
      Math.round(porcentagem / 5),
      faixas.length - 1
    );

    faixas[indice].quantidade++;
  }

  return faixas;
}

export async function leiturasPorMes(usuarioId: string, ano: number=2026) {
  const leituras = await prisma.biblioteca.findMany({
    where: {
      usuarioId: usuarioId,
      dataInicio: {
        gte: new Date(`${ano}-01-01`),
        lte: new Date(`${ano}-12-31`),
      },
    },
    select: {
      dataInicio: true,
    },
  });


  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const dadosAgrupados = meses.map((mes) => ({ mes, quantidade: 0 }));

  leituras.forEach((item) => {
    if (item.dataInicio) {
      const mesIndice = new Date(item.dataInicio).getMonth();
      dadosAgrupados[mesIndice].quantidade++;
    }
  });

  return dadosAgrupados;
}

