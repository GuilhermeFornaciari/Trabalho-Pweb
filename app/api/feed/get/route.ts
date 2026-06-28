import { buscarPostagensFeed } from "@/lib/data/feedDAO";

import { z } from "zod";

const recentlySchema = z.object({
  pagina: z.coerce.number().int().positive(),
});


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = recentlySchema.safeParse({
      pagina: searchParams.get("pagina"),
    });

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }
    
    const {pagina} = resultado.data;
    const postagens = await buscarPostagensFeed(pagina);

    return Response.json(postagens);

  } catch (e) {
    console.error("Erro ao buscar feed:", e);
    return Response.json(
      { message: "Não foi possível realizar a busca do feed." },
      { status: 500 }
    );
  }
}