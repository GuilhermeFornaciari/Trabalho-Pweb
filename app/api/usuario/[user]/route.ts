import { auth } from "@/lib/auth";
import { z } from "zod";
import { getByUsername } from "@/lib/service/UsuarioService";

const usuarioUser = z.string();

export async function GET( request: Request, { params }: { params: { user: string } }) {
  const session = await auth();
  
  if(!session) {
    return Response.json(
      {message: "Não autorizado: usuário não logado."},
      {status: 401}
    )
  }

  const { user } = await params;
  const resultado = usuarioUser.safeParse(user);
  
  if (!resultado.success) {
    return Response.json(
      { erro: resultado.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  
  const username  = resultado.data;
  return Response.json(await getByUsername(username));
}