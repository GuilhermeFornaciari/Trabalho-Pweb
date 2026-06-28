import { livrosResenhasRecentes } from "@/lib/data/postagemDAO";
import { z } from "zod";

const recentlySchema = z.object({
  id: z.coerce.number().int().positive(),
  pagina: z.coerce.number().int().positive(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = recentlySchema.safeParse({
      id: searchParams.get("livroId"),
      pagina: searchParams.get("pagina"),
    });

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { id, pagina } = resultado.data;

    return Response.json(await livrosResenhasRecentes(id, pagina));

  } catch (e) {
    return Response.json(
      { message: "Não foi possível realizar a busca." },
      { status: 500 }
    );
  }
}