import bcrypt from "bcryptjs";
import * as dataDAO from "../../data/userDAO";

export async function createUser(data: {
  email: string,
  senha: string, 
  nome: string, 
  username: string
}) {
  const hashedPassword = await bcrypt.hash(data.senha, 10);

  try {
    return await dataDAO.create( data.email, hashedPassword, data.nome, "", data.username);
  } catch (error) {
    throw error;
  }
}