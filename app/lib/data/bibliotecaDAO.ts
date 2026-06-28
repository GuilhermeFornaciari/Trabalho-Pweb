import { StatusLeitura } from "../prisma/generated/enums";
import PrismaSingleton from "../prisma/PrismaSingleton";
import Biblioteca from "@/(entidades)/biblioteca";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function salvarLivro(dados: Biblioteca) {
  return await prisma.biblioteca.upsert({
    where: {
      usuarioId_livroId: {
        usuarioId: dados.usuarioId,
        livroId: dados.livroId,
      },
    },
    update: {
      status: dados.status,
      dataInicio: dados.dataInicio,
      dataConclusao: dados.dataConclusao,
    },
    create: {
      usuarioId: dados.usuarioId,
      livroId: dados.livroId,
      status: dados.status,
      dataInicio: dados.dataInicio,
      dataConclusao: dados.dataConclusao,
    },
  });
}