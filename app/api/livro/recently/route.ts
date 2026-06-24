import { livrosRecentes } from "@/lib/service/livro/LivroService";
import { z } from "zod";

const recentlySchema = z.object({
  quantidade: z.coerce.number().min(1).default(10),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = recentlySchema.safeParse({
      quantidade: searchParams.get("quantidade") ?? undefined,
    });

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { quantidade } = resultado.data;

    return Response.json(await livrosRecentes(quantidade));

  } catch (e) {
    return Response.json(
      { message: "Não foi possível realizar a busca." },
      { status: 500 }
    );
  }
}