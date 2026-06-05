import Livro from "@/(entidades)/livro";
import PrismaSingleton from "@/lib/prisma/PrismaSingleton";
import { connect } from "node:http2";

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

