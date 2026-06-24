import { getLivroById } from "@/lib/data/livroDAO";
import { z } from "zod";

const idSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function GET( request: Request, { params }: { params: { id: string } }) {
  try {
    const {id} = await params

    const resultado = idSchema.safeParse({
      id: id,
    });

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const livroId = resultado.data.id;

    const search = await getLivroById(livroId);

    if (!search) {
      return Response.json(
        { message: "Livro não encontrado." },
        { status: 404 }
      );
    }

    return Response.json(search);

  } catch (e) {
    return Response.json(
      { message: "Erro ao buscar livro pelo id." },
      { status: 500 }
    );
  }
}