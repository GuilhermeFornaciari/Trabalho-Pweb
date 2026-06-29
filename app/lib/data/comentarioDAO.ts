import PrismaSingleton from "@/lib/prisma/PrismaSingleton";
import { Comentario } from "../prisma/generated/client";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function upsertComentario(
  dados: Omit<Comentario, "id" | "createdAt">, 
  id?: number
) {
  // Se não receber um ID válido de edição, usamos -1 para forçar o Prisma a ir para o bloco 'create'
  const idParaBuscar = id ?? -1;

  return prisma.comentario.upsert({
    where: {
      id: idParaBuscar,
    },
    update: {
      texto: dados.texto, 
    },
    create: {
      postagemId: dados.postagemId,
      usuarioId: dados.usuarioId,
      texto: dados.texto,
      data: dados.data,
      parentId: dados.parentId,
    },
  });
}


export async function deleteComent(id: number){
    return prisma.comentario.delete({
        where:{id}
    })

}