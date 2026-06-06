import Livro from "@/(entidades)/livro";
import PrismaSingleton from "@/lib/prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function createLivro(livro: Livro) {
  const novoLivro = await prisma.livro.create({
    data: {
      titulo: livro.titulo,
      ano: livro.ano,
      genero: livro.genero,
      paginas: livro.paginas,
      capa: livro.capa,
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

export async function getLivroById(id: number) {
  return await prisma.livro.findUnique({
    where: {
      id: id
    }
  });
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
      .map(a => a.autor.nome)
      .join(", "),
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
      createdAt: "asc"
    },
    take: quantidade
  })
  return livrosRecentes.map(livro => ({
    ...livro, 
    autores: livro.autores
      .map(a => a.autor.nome)
      .join(", "),
  }));
}