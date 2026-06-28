import { z } from "zod";
import { Postagem } from "@/lib/prisma/generated/client";
import { createResenha } from "@/lib/data/postagemDAO";

const createSchema = z.object({
  livroId: z.coerce.number().int().positive(),
  usuarioId: z.string(),
  titulo: z.string(),
  texto: z.string(),
  nota: z.int().min(0).max(5),
  spoiler: z.boolean(),
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


    const postagem: Omit<Postagem, "id"> = {
      livroId: dados.livroId,
      usuarioId: dados.usuarioId,
      titulo: dados.titulo,
      texto: dados.texto,
      nota: dados.nota,
      temSpoiler: dados.spoiler,
      data: new Date(),
      paginaAtual: null,
      paginasLidas: null,
    };

    const res = await createResenha(postagem);


    return Response.json(res, { status: 201 });

  } catch (e) {
    console.error(e);

    return Response.json(
      { message: "Não foi possível salvar a resenha." },
      { status: 500 }
    );
  }
}