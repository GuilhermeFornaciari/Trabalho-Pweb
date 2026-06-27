import { StatusLeitura } from "../prisma/generated/enums";
import PrismaSingleton from "../prisma/PrismaSingleton";
import Biblioteca from "@/(entidades)/biblioteca";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function adicionarLivro(dados: Biblioteca) {
  const resultado = await prisma.$transaction(async (tx) => {
    const biblioteca = await tx.biblioteca.create({
      data: {
        usuarioId: dados.usuarioId,
        livroId: dados.livroId,
        status: dados.status,
        dataInicio: dados.dataInicio,
        dataConclusao: dados.dataConclusao
      }
    })

    if(dados.status === StatusLeitura.LENDO) {
      await tx.postagem.create({
        data: {
          paginaAtual: 0,
          paginasLidas: 0,
          nota: null,
          titulo: null,
          texto: null,
          temSpoiler: false,
          usuarioId: dados.usuarioId,
          livroId: dados.livroId
        }
      })
    }

    return biblioteca;
  });

  return resultado;
}