import { livrosPorStatus } from "@/lib/data/livroDAO";
import { auth } from "@/lib/auth";
import { z } from "zod";

const idSchema = z.object({
  usuarioId: z.string().min(1),
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
    const usuarioId = searchParams.get("usuario");

    const resultado = idSchema.safeParse({
      usuarioId
    });

    if (!resultado.success) {
      return Response.json(
        { erro: resultado.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const dados = resultado.data;
    const search = await livrosPorStatus(dados.usuarioId);

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
      { message: "Erro ao buscar quantidade de livros por status" },
      { status: 500 }
    );
  }
}