import { createAutor } from "@/lib/data/autorDAO";
import { z } from "zod";

const createSchema = z.object({
  nome: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const resultado = createSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { nome } = resultado.data;

    const res = await createAutor({ nome });

    return Response.json(res, { status: 201 });

  } catch (e) {
    console.log(e);

    return Response.json(
      { message: "Não foi possível registrar o autor." },
      { status: 500 }
    );
  }
}