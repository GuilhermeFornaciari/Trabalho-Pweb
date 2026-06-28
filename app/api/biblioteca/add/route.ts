import Biblioteca from "@/(entidades)/biblioteca";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { save } from "@/lib/service/BibliotecaService";

const addSchema = z.object({
  livroId: z.coerce.number().int().positive(),
  status: z.enum(["LIDO", "LENDO", "QUERO_LER", "ABANDONEI"])
})

export async function POST(request: Request) {
  const session = await auth();

  if(!session?.user.id) {
    return Response.json(
      {message: "Não autorizado: usuário não logado."},
      {status: 401}
    )
  }

  const req = await request.json();
  const valiDados = addSchema.safeParse(req);

  if(!valiDados.success) {
    return Response.json(
      {
        message: "Dados inválidos.",
        erros: valiDados.error.issues
      },
      {status: 400},
    );
  }

  const dados = valiDados.data;
  const biblioteca = new Biblioteca (
    session.user.id,
    dados.livroId,
    dados.status,
    (dados.status === "LENDO") ? new Date() : null,
    null 
  ) 
  return Response.json(await save(biblioteca));
}