import { deleteColecao } from "@/lib/data/colecaoDAO";
import { z } from "zod";

const deleteSchema = z.coerce.number().int().positive();

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = deleteSchema.safeParse(
      searchParams.get("id")
    );

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const id = resultado.data;

    await deleteColecao(id);

    return Response.json(
      { success: true },
      { status: 200 }
    );

  } catch (e) {
    return Response.json(
      { message: "Não foi possível realizar a remoção da coleção." },
      { status: 500 }
    );
  }
}