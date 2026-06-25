import { findByUsername } from "@/lib/data/userDAO";
import { z } from "zod";

const usuarioUser = z.string();

export async function GET( request: Request, { params }: { params: { user: string } }) {
  try {
    const { user } = await params;
    const resultado = usuarioUser.safeParse(user);
    
    if (!resultado.success) {
      return Response.json(
        { erro: resultado.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const username  = resultado.data;

    const usuario = await findByUsername(username);

    if(!usuario) {
      console.log(usuario);
      return Response.json(
        { erro: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return Response.json(usuario, { status: 200 });

  } catch (error) {
    return Response.json(
      { erro: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}