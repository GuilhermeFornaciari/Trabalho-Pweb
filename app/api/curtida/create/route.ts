import { curtirPostComent } from "@/lib/data/curtidaDAO";
import { z } from "zod";

const createSchema = z.object({
  usuarioId: z.string(),
  postagemId: z.coerce.number().int().positive().optional(),
  comentarioId: z.coerce.number().int().positive().optional(),
    }).refine(
      (data) =>
        (data.postagemId !== undefined && data.comentarioId === undefined) ||
        (data.postagemId === undefined && data.comentarioId !== undefined),
      {
        message: "Informe apenas postagemId ou comentarioId.",
        path: ["postagemId"],
      }
);

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const resultado = createSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 401 }
      );
    }

    const { usuarioId, postagemId, comentarioId } = resultado.data;

    const res = await curtirPostComent(usuarioId, postagemId ?? null, comentarioId ?? null);
    
    return Response.json(res, { status: 201 });


  } catch(e){
    console.error(e);

        return Response.json(
      { message: "Não foi possível registrar o livro." },
      { status: 500 }
    );
  }
}