import { discussao } from "@/lib/data/livroDAO";
import { auth } from "@/lib/auth";
import { z } from "zod";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return Response.json(
      { message: "Não autorizado: usuário não logado." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const resultado = idSchema.safeParse({
      id: id,
    });

    if (!resultado.success) {
      return Response.json(
        { erro: resultado.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const livroId = resultado.data.id;

    const search = await discussao(livroId);

    if (!search) {
      return Response.json(
        { message: "Dados não encontrados" },
        { status: 404 }
      );
    }

    return Response.json(search);

  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "Erro ao buscar dados de discussao." },
      { status: 500 }
    );
  }
}