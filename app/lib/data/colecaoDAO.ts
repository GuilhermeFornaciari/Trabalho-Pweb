"use server";

import PrismaSingleton from "../prisma/PrismaSingleton";

export async function colecaoCreate( nome: string ){

    const prisma = PrismaSingleton.getInstance().prismaClient.colecao;
    
    return prisma.create({data:{nome}});
}

