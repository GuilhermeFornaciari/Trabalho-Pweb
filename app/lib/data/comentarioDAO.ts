import PrismaSingleton from "@/lib/prisma/PrismaSingleton";
import { Comentario } from "../prisma/generated/client";

const prisma = PrismaSingleton.getInstance().prismaClient;


export async function createComentario(dados: Omit<Comentario, "id" | "createdAt">){
    return prisma.comentario.create({
        data: dados
    })
}