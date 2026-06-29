import { StatusLeitura } from "../prisma/generated/enums";
import PrismaSingleton from "../prisma/PrismaSingleton";
import Biblioteca from "@/(entidades)/biblioteca";
import { Prisma } from "@/lib/prisma/generated/client";

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

export async function sincronizarBiblioteca(
  tx: Prisma.TransactionClient,
  usuarioId: string,
  livroId: number
) {
  const ultimoProgresso = await tx.postagem.findFirst({
    where: {
      usuarioId,
      livroId,
      paginaAtual: {
        not: null,
      },
    },
    orderBy: {
      data: "desc",
    },
    select: {
      paginaAtual: true,
    },
  });

  const resenha = await tx.postagem.findFirst({
    where: {
      usuarioId,
      livroId,
      nota: {
        not: null,
      },
    },
    orderBy: {
      data: "desc",
    },
    select: {
      nota: true,
    },
  });

  return tx.biblioteca.update({
    where: {
      usuarioId_livroId: {
        usuarioId,
        livroId,
      },
    },
    data: {
      paginaAtual: ultimoProgresso?.paginaAtual ?? 0,
      nota: resenha?.nota ?? null,
    },
  });
}