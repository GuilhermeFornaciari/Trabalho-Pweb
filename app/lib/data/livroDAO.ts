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
        // Deleta os vínculos antigos desse livro na tabela intermediária
        deleteMany: {}, 
        // Cria os novos vínculos com os IDs atuais
        create: livro.autores.map((id: number) => ({
          autor: {
            connect: { id: id }
          }
        }))
      }
    },
  });
}

// se der erro, retorna excessao
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




export async function getLivroById(id: number) {
  const livro = await prisma.livro.findUnique({
    where: { id },
    include: {
      autores: {
        include: {
          autor: true,
        },
      },
    },
  });

  if(!livro) return null;

  return {
    ...livro,
    autores: livro?.autores.map((a) => a.autor) ?? [],
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