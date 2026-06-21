import { z } from "zod";
import { deleteLivro } from "@/lib/data/livroDAO";

const deleteSchema = z.object({
  id: z.coerce.number().int().positive(),
  colecaoId: z.coerce.number().int().positive().nullable().optional(),
});

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = deleteSchema.safeParse({
      id: searchParams.get("id"),
      colecaoId: searchParams.get("colecaoId"),
    });

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { id, colecaoId } = resultado.data;

    await deleteLivro(id, colecaoId ?? null);

    return Response.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: "Erro ao excluir livro." },
      { status: 500 }
    );
  }
}