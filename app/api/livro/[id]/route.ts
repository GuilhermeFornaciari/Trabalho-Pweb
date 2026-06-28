import { getLivroById } from "@/lib/data/livroDAO";
import { auth } from "@/lib/auth";
import { z } from "zod";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function GET( request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if(!session) {
    return Response.json(
      { message: "Não autorizado: usuário não logado."},
      { status: 401 }
    )
  }

  try {
    const {id} = await params;

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

    const search = await getLivroById(livroId, session.user);

    if (!search) {
      return Response.json(
        { message: "Livro não encontrado." },
        { status: 404 }
      );
    }

    console.log(search);
    return Response.json(search);

  } catch (e) {
    return Response.json(
      { message: "Erro ao buscar livro pelo id." },
      { status: 500 }
    );
  }
}