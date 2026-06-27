import PrismaSingleton from "../prisma/PrismaSingleton";
import Biblioteca from "@/(entidades)/biblioteca";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function adicionarLivro(dados: Biblioteca) {
  const resultado = await prisma.biblioteca.create({
    data: {
      usuarioId: dados.usuarioId,
      livroId: dados.livroId,
      status: dados.status,
      dataInicio: dados.dataInicio,
      dataConclusao: dados.dataConclusao
    }
  })
}