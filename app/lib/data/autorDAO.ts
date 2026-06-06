import Autor from "@/(entidades)/autor";
import PrismaSingleton from "@/lib/prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function createAutor(autor: Autor): Promise<Autor> {
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