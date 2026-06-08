import Autor from "@/(entidades)/autor";
import PrismaSingleton from "@/lib/prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function createAutor(autor: Autor): Promise<Autor> { // cade service, tabares??
  return await prisma.autor.create({
    data: {
      nome: autor.nome
    },
  });
}

export async function findAutoresPorNome(nome: string): Promise<Autor[]> {
  return await prisma.autor.findMany({
    where: {
      nome: {
        contains: nome,
        mode: "insensitive"
      }
    }
  });
}

export async function findAutorPorId(id: number) {
  const prisma = PrismaSingleton.getInstance().prismaClient;

  const autor = await prisma.autor.findUnique({
    where: { id }
  });

  if (!autor) {
    return {
      message: "Autor não encontrado",
      status: 404
    };
  }

  return autor;
}

export async function updateAutor(autor: Autor) {
  
  return prisma.autor.update({
    where: {
      id: autor.id,
    },
    data: {
      nome: autor.nome,
    },
  });
}

export async function deleteAutor(autor: Autor) {
  // tem que ver ainda 
  return prisma.autor.delete({
    where: {
      id: autor.id,
    }
  });
}