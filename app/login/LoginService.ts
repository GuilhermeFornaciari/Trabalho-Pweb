"use server"

import { user } from "../lib/prisma/generated/client";
import PrismaSingleton from "../lib/prisma/PrismaSingleton";

import bcrypt from "bcryptjs";

export async function findUser(email: string, senha: string) {
  const user = await usuario().findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha);

  if (!senhaCorreta) {
    return null;
  }

  return user;
}

function usuario() {
    return PrismaSingleton.getInstance().prismaClient.user
}



