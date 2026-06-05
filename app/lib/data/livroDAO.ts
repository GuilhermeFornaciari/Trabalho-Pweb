import Livro from "@/(entidades)/livro";
import PrismaSingleton from "@/lib/prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function createLivro(livro: Livro): Promise<Livro> {
  return await prisma.livro.create({
    data: {
      titulo: livro.titulo,
      ano: livro.ano,
      genero: livro.genero,
      paginas: livro.paginas,
      capa: livro.capa
    },
  });
}

export async function getLivroById(id: number): Promise<Livro | null> {
  return await prisma.livro.findUnique({
    where: {
      id: id
    }
  });
}

