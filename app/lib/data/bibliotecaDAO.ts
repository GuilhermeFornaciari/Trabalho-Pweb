import { StatusLeitura } from "../prisma/generated/enums";
import PrismaSingleton from "../prisma/PrismaSingleton";
import Biblioteca from "@/(entidades)/biblioteca";
import { Prisma } from "@/lib/prisma/generated/client";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function salvarLivro(dados: Biblioteca) {
  const livro = await prisma.livro.findUnique({
    where: {
      id: dados.livroId,
    },
    select: {
      paginas: true,
    },
  });

  if (!livro) {
    throw new Error("Livro não encontrado.");
  }

  const updateData: Prisma.BibliotecaUpdateInput = {
    status: dados.status,
    dataInicio: dados.dataInicio,
    dataConclusao: dados.dataConclusao,
  };

  const createData: Prisma.BibliotecaCreateInput = {
    usuario: {
      connect: { id: dados.usuarioId },
    },
    livro: {
      connect: { id: dados.livroId },
    },
    status: dados.status,
    dataInicio: dados.dataInicio ?? new Date(),
    dataConclusao: dados.dataConclusao,
  };

  if (dados.status === "LIDO") {
    updateData.paginaAtual = livro.paginas;
    updateData.dataConclusao ??= new Date();

    createData.paginaAtual = livro.paginas;
    createData.dataConclusao ??= new Date();
  }

  return prisma.biblioteca.upsert({
    where: {
      usuarioId_livroId: {
        usuarioId: dados.usuarioId,
        livroId: dados.livroId,
      },
    },
    update: updateData,
    create: createData,
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

export async function saveDates(
  usuarioId: string, livroId: number, dataInicial: Date | null, dataFinal: Date | null
) {
  return await prisma.biblioteca.update({
    where: {
      usuarioId_livroId: {
        usuarioId,
        livroId,
      },
    },
    data: {
      dataInicio: dataInicial,
      dataConclusao: dataFinal,
    },
  });
}