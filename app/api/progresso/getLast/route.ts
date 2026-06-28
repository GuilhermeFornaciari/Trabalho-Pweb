import { auth } from "@/lib/auth";
import { getUltimoProgresso } from "@/lib/service/PostagemService";
import { z } from "zod";

const progressoSchema = z.object({
  usuarioId: z.string().min(1),
  livroId: z.coerce.number().int().positive()
});

export async function GET(request: Request, {params}: {params: { dados: {usuarioId: string, livroId: string}}}) {
  const session = await auth();

  if(!session?.user.id) {
    return Response.json(
      {message: "Não autorizado: usuário não logado."},
      {status: 401}
    )
  }

  const {dados} = await params;
  const valiDados = progressoSchema.safeParse(dados);

  if(!valiDados.success) {
    return Response.json(
      {erro: valiDados.error.flatten().fieldErrors},
      {status: 400}
    )
  }

  const d = valiDados.data;
  return Response.json(await getUltimoProgresso(d.usuarioId, d.livroId));
}