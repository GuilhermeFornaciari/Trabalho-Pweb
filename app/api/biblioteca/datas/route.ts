import { auth } from "@/lib/auth";
import { z } from "zod";
import { updateDates } from "@/lib/service/BibliotecaService";

const addSchema = z.object({
  livroId: z.coerce.number().int().positive(),
  dataInicio: z.coerce.date().optional(),
  dataFim: z.coerce.date().optional(),
});

export async function PUT(request: Request) {
  const session = await auth();

  if(!session?.user.id) {
    return Response.json(
      {message: "Não autorizado: usuário não logado."},
      {status: 401}
    )
  }

  const req = await request.json();
  const valiDados = addSchema.safeParse(req);

  console.log(req);

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
  return Response.json(await updateDates(session.user.id, dados.livroId, dados.dataInicio, dados.dataFim));
}