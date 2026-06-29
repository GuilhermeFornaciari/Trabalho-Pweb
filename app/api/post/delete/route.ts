import { z } from "zod";
import { auth } from "@/lib/auth";
import { deletarPostagem } from "@/lib/service/PostagemService";

const deleteSchema = z.object({
  postId: z.coerce.number().int().positive(),
});

export async function DELETE(request: Request) {
  const session = await auth();
  
  if(!session?.user.id) {
    return Response.json(
      {message: "Não autorizado: usuário não logado."},
      {status: 401}
    )
  }

  const req = await request.json();
  const valiDados = deleteSchema.safeParse(req);

  if(!valiDados.success) {
    return Response.json(
      {message: "ID do post inválido."},
      {status: 400}
    )
  } 

  return Response.json(await deletarPostagem(session.user.id, valiDados.data.postId));
}