import { Postagem } from "../prisma/generated/client";
import { createProgresso } from "../data/postagemDAO";

export async function addProgresso(dados: Omit<Postagem, "id">) {
  try {
    const resultado = await createProgresso(dados);
    if(!resultado) {
      return Response.json(
        { message: "Não foi possível salvar o progresso." },
        { status: 500 }
      );
    }
    return {dados: resultado, status: 200}
  } catch (e) {
    console.error(e);

    return Response.json(
      { message: "Não foi possível salvar o progresso." },
      { status: 500 }
    );
  }
}