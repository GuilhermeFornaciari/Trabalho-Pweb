"use server"

import { user } from "../../lib/prisma/generated/client";
import PrismaSingleton from "../../lib/prisma/PrismaSingleton";
export async function find_many(filters: any = {}):Promise<user[]>{
    return table().findMany({
        where: filters
    })
}
export async function find_one(id: number):Promise<user>{
    const user = await table().findFirst({
        where: {
            id,
        }
    })
    if (user == null) throw new Error("Usuario não encontrado");
    return user
}
export async function update(entity:user):Promise<void>{
    await table().update({
        where: {
            id: entity.id
        },
        data: entity
    }
    )
}
export async function create(entity: user):Promise<void>{
    await table().create({
        data: entity
    })
}

export async function deleteUser(entity: user ):Promise<void>{
    await table().delete({
        where: {
            id: entity.id
        }
    })
}

function table() {
    return PrismaSingleton.getInstance().prismaClient.user
}
