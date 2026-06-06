"use server"

import PrismaSingleton from "../../lib/prisma/PrismaSingleton";

export async function findLivros(valor: string, filtro: string) {

  switch (filtro) {
    case "titulo":
      const livrosT = await livro().findMany({
          where: {
            titulo: {
              contains: valor,
              mode: "insensitive",
            },
          },
          include: {
            autores: {
              include: {
                autor: true,
              },
            },
          },
        });

        

    return livrosT.map(livro => ({
          ...livro,
          autoresTexto: livro.autores
            .map(a => a.autor.nome)
            .join(", "),
        }));



    case "genero":
      const livrosG = await livro().findMany({
        where: {
          genero: {
            contains: valor,
            mode: "insensitive",
          },
        },
         include: {
            autores: {
              include: {
                autor: true,
              },
            },
          },
      });

      return livrosG.map(livro => ({
          ...livro,
          autoresTexto: livro.autores
            .map(a => a.autor.nome)
            .join(", "),
        }));





    case "ano":
      const livrosA = await livro().findMany({
        where: valor
          ? { ano: Number(valor) }
          : {},
        include: {
          autores: {
            include: {
              autor: true,
            },
          },
        },
      });

      return livrosA.map(livro => ({
        ...livro,
        autoresTexto: livro.autores
          .map(a => a.autor.nome)
          .join(", "),
      }));




    case "autor":
        const livrosAA = await livro().findMany({
            include: {
    autores: {
      include: {
        autor: true
      }
    }
  }
        });
        return livrosAA.map(livro => ({
          ...livro,
          autoresTexto: livro.autores
            .map(a => a.autor.nome)
            .join(", "),
        }));

    default:
      return [];
  }
}

function livro() {
  return PrismaSingleton.getInstance().prismaClient.livro;
}