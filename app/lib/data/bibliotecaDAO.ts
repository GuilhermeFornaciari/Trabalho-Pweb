import { StatusLeitura } from "../prisma/generated/enums";
import PrismaSingleton from "../prisma/PrismaSingleton";
import Biblioteca from "@/(entidades)/biblioteca";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function salvarLivro(dados: Biblioteca) {
  return await prisma.$transaction(async (tx) => {
    const bibliotecaExistente = await tx.biblioteca.findUnique({
      where: {
        usuarioId_livroId: {
          usuarioId: dados.usuarioId,
          livroId: dados.livroId,
        },
      },
    });

    const biblioteca = await tx.biblioteca.upsert({
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

    if(!bibliotecaExistente && dados.status === StatusLeitura.LENDO) {
      await tx.postagem.create({
        data: {
          paginaAtual: 0,
          paginasLidas: 0,
          nota: null,
          titulo: null,
          texto: null,
          temSpoiler: false,
          usuarioId: dados.usuarioId,
          livroId: dados.livroId,
        },
      });
    }

    return biblioteca;
  });
}