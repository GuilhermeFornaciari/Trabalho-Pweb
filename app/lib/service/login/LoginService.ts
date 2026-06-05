"use server"

import { find } from "@/lib/data/userDAO";

import bcrypt from "bcryptjs";

export async function login(email: string, senha: string) {
  const user = await find(email);
  console.log("passou")

  if (!user) {
    return null;
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha);

  if (!senhaCorreta) {
    return null;
  }

  return user;
}



