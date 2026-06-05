"use server";

import PrismaSingleton from "../prisma/PrismaSingleton";

export async function create(email: string, senha: string, nome: string, foto:string){

    const prisma = PrismaSingleton.getInstance().prismaClient.user;
    
    const data = ({ email, senha,  nome,foto })
 
    return prisma.create({ data });
}

export async function find(email: string){
  console.log("chegou");
  return PrismaSingleton.getInstance().prismaClient.user.findUnique({
    where: { email },
  });
}