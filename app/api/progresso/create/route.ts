import { auth } from "@/lib/auth";
import { z } from "zod";
import { Postagem } from "@/lib/prisma/generated/client";
import { addProgresso } from "@/lib/service/PostagemService";

const addSchema = z.object({
  paginaAtual: z.coerce.number().int().min(0),
  paginasLidas: z.coerce.number().int().positive(),
  texto: z.string(),
  temSpoiler: z.boolean(),
  livroId: z.coerce.number().int().positive().min(1),
})

export default async function POST(request: Request) {
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

  const postagem: Omit<Postagem, "id"> = {
    livroId: dados.livroId,
    usuarioId: session.user.id,
    titulo: null,
    texto: dados.texto,
    nota: null,
    temSpoiler: dados.temSpoiler,
    data: new Date(),
    paginaAtual: dados.paginaAtual,
    paginasLidas: dados.paginasLidas,
  };

  return Response.json(await addProgresso(postagem));
}