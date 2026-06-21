import { updateColecao } from "@/lib/data/colecaoDAO";
import { z } from "zod";

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  nome: z.string().min(1),
  livros: z.array(
    z.object({
      id: z.coerce.number().int().positive(),
      posicao: z.coerce.number().int().min(0),
    })
  ).min(0),
});

export async function PUT(request: Request) {
  try {
    const req = await request.json();

    const resultado = updateSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { id, nome, livros } = resultado.data;

    const res = await updateColecao(id, nome, livros);

    return Response.json(res, { status: 200 });

  } catch (e) {
    console.log(e);

    return Response.json(
      { message: "Não foi possível atualizar a coleção." },
      { status: 500 }
    );
  }
}