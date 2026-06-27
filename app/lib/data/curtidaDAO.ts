import PrismaSingleton from "@/lib/prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;


export async function curtirPostComent(usuarioId: string, postagemId: number | null, comentarioId: number | null){
    return prisma.curtida.create({
        data:{
            usuarioId,
            postagemId,
            comentarioId,
        }
    })
}

export async function deleteCurtidaPostComent(curtidaId: number){
    return prisma.curtida.delete({
        where: {
            id: curtidaId,
        }
    })
}

export async function verCurtida(usuarioId: string, postagemId: number | null, comentarioId: number | null) {
    if (postagemId !== null) {
        return prisma.curtida.findUnique({
            where: {
                usuarioId_postagemId: {
                  usuarioId,
                  postagemId,
                },
            },
        });
    }

    return prisma.curtida.findUnique({
        where: {
            usuarioId_comentarioId: {
            usuarioId, 
            comentarioId: comentarioId!, // garantir que n é null. TS reclama
            },
        },
    });
}