import { auth } from "@/lib/auth";
import { editarProgresso } from "@/lib/service/PostagemService";
import { z } from "zod";

const editSchema = z.object({
  postId: z.number().positive(),
  texto: z.string().optional(),
  temSpoiler: z.boolean()
})

export async function PUT(request: Request) {
  const session = await auth();

  if(!session?.user.id) {
    return Response.json(
      {message: "Não autorizado: usuário não logado."},
      {status: 401}
    )
  }

  const req = await request.json();
  const valiDados = editSchema.safeParse(req);

  if(!valiDados.success) {
    return Response.json(
      {message: "ID do post inválido."},
      {status: 400}
    )
  }

  return Response.json(await editarProgresso(session.user.id, valiDados.data));
}