import { Postagem } from "../prisma/generated/client";
import { createProgresso, ultimoProgresso } from "../data/postagemDAO";

export async function addProgresso(dados: Omit<Postagem, "id">) {
  try {
    const resultado = await createProgresso(dados);
    if(!resultado) {
      return { message: "Não foi possível salvar o progresso.", status: 500 };
    }
    return {dados: resultado, status: 200}
  } catch (e) {
    console.error(e);

    return { message: "Não foi possível salvar o progresso.", status: 500 };
  }
}

export async function getUltimoProgresso(usuarioId: string, livroId: number) {
  try {
    const resultado = await ultimoProgresso(usuarioId, livroId);
    return {dados: resultado, status: 200}
  } catch(e) {
    console.error(e);

    return { message: "Não foi possível recuperar o último progresso.", status: 500 };
  }
} 