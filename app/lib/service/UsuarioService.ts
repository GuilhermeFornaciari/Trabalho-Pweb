import { findByUsername } from "../data/userDAO";

export async function getByUsername(username: string) {
  try {
    const usuario = await findByUsername(username);
    if(!usuario) {
      return { message: "Usuário não encontrado", status: 404 };
    }
    return {dados: usuario, status: 200};
  } catch(e) {
    console.error(e);
    return {message: "Não foi possível buscar usuário.", status: 500}
  }
} 