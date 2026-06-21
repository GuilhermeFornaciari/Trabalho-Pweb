import { z } from "zod";
import { getLivros } from "@/lib/data/livroDAO";

const querySchema = z.object({
  valor: z.string().default(""),
  filtro: z.enum(["titulo", "autor", "genero"]),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = querySchema.safeParse({
      valor: searchParams.get("valor"),
      filtro: searchParams.get("filtro"),
    });

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { valor, filtro } = resultado.data;

    const livros = await getLivros(valor, filtro);

    return Response.json(livros, { status: 200});

  } catch (e) {
    return Response.json(
      { message: "Não foi possível realizar a busca." },
      { status: 500 }
    );
  }
}