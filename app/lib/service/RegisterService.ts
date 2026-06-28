import { create } from "../data/userDAO"

export async function createUser(data: {
  email: string,
  senha: string, 
  nome: string, 
  username: string
}) {
  try {
    const usuario = await create(data);
    if(!usuario) {
      return {message: "Não foi possível criar usuário", status: 500}
    }
    return {dados: usuario, status: 201};
  } catch (error) {
    return {message: "Erro ao criar o usuário", status: 500}
  }
}