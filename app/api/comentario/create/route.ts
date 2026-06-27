import { z } from "zod";
import { Comentario } from "@/lib/prisma/generated/client";
import { createComentario } from "@/lib/data/comentarioDAO";

const createSchema = z.object({
  postagemId: z.coerce.number().int().positive(),
  usuarioId: z.string(),
  texto: z.string().min(1),
  comentarioId: z.coerce.number().int().positive().optional(),
});

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const resultado = createSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 411 }
      );
    }

    const dados = resultado.data;


    const comentario: Omit<Comentario, "id"> = {
      postagemId: dados.postagemId,
      usuarioId: dados.usuarioId,
      texto: dados.texto,
      data: new Date(),
      parentId: dados.comentarioId ?? null,
    };

    const res = await createComentario(comentario);


    return Response.json(res, { status: 201 });

  } catch (e) {
    console.error(e);

    return Response.json(
      { message: "Não foi possível registrar o livro." },
      { status: 500 }
    );
  }
}