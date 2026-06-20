"use server";

import { json } from "stream/consumers";
import { User } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";
import { stringify } from "querystring";

export async function create(email: string, senha: string, nome: string, foto:string){

    const prisma = PrismaSingleton.getInstance().prismaClient.user;
    
    const data = ({ email, senha,  nome,foto })
 
    return prisma.create({ data });
}

export async function find(email: string){
  // console.log("chegou");
  const opa = await  PrismaSingleton.getInstance().prismaClient.user.findUnique({
    where: { email },
  });
  
  console.log(JSON.stringify(opa));
  console.log("chagou e passou");
  return opa;
}


export async function updateUser(user: User) {
    const opa  = await  PrismaSingleton.getInstance().prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        nome: user.nome,
        email: user.email,
        senha: user.senha,
        foto: user.foto,
      },
    });

    console.log(JSON.stringify(opa));
}