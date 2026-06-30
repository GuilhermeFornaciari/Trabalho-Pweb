import { buscarPostagensFeed } from "@/lib/data/feedDAO";
import { auth } from "@/lib/auth"; 
import { z } from "zod";

const feedSchema = z.object({
  pagina: z.coerce.number().int().positive(),
  filtro: z.string(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = feedSchema.safeParse({
      pagina: searchParams.get("pagina"),
      filtro: searchParams.get("filtro"),
    });

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }
    
    const { pagina, filtro } = resultado.data;
    
    let usuarioId: string | undefined = undefined;

    if (filtro === "Amigos") {
      const session = await auth();
      
      if (!session?.user?.id) {
        return Response.json(
          { message: "Não autorizado. Faça login para ver o feed de amigos." },
          { status: 401 }
        );
      }

      usuarioId = session.user.id; 
    }

    const postagens = await buscarPostagensFeed(pagina, filtro, usuarioId);
    return Response.json(postagens);

  } catch (e) {
    console.error("Erro ao buscar feed:", e);
    return Response.json(
      { message: "Não foi possível realizar a busca do feed." },
      { status: 500 }
    );
  }
}