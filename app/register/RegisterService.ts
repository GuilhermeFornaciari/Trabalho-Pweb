"use server"

import PrismaSingleton from "../lib/prisma/PrismaSingleton";
import bcrypt from "bcryptjs";

export async function createUser( email: string, senhaPura: string, nome: string){
  const hashedPassword = await bcrypt.hash(senhaPura, 10);
    
  const foto = "";
  const user = await usuario().create({
    data: {
      email,
      senha: hashedPassword,
      nome,
      foto
    },
  });

  return user;
}

function usuario() {
  return PrismaSingleton.getInstance().prismaClient.user;
}