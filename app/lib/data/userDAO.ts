"use server";

import { json } from "stream/consumers";
import { User } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";
import { stringify } from "querystring";

export async function create(email: string, senha: string, nome: string, foto:string, username: string, bio: string){

    const prisma = PrismaSingleton.getInstance().prismaClient.user;
    
    const data = ({ email, senha,  nome, foto, username, bio })
 
    return prisma.create({ data });
}

export async function find(id: string){
  // console.log("chegou");
  const opa = await  PrismaSingleton.getInstance().prismaClient.user.findUnique({
    where: { id },
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
        bio: user.bio,
        username: user.username,
      },
    });
    
    console.log(JSON.stringify(opa));

    return opa;

}