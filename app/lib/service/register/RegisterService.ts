
"use server";

import bcrypt from "bcryptjs";
import * as dataDAO from "../../data/userDAO";

export async function createUser(email: string, senhaPura: string, nome: string) {
  const hashedPassword = await bcrypt.hash(senhaPura, 10);

  try {
    return await dataDAO.create( email, hashedPassword, nome, "");
  } catch (error) {
    throw error;
  }
}