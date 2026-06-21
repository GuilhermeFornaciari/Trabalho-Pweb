import { updateAutor } from "@/lib/data/autorDAO";
import { z } from "zod";

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  nome: z.string().min(1),
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

    const { id, nome } = resultado.data;

    const autor = {
      id,
      nome,
    };

    const res = await updateAutor(autor);

    return Response.json(res, { status: 200 });

  } catch (e) {
    console.log(e);

    return Response.json(
      { message: "Não foi possível atualizar o autor." },
      { status: 500 }
    );
  }
}