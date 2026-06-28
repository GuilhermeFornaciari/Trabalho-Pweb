import { getAutorId } from "@/lib/service/AutorService";
import { z } from "zod";

const idSchema = z.coerce.number().int().positive();

export async function GET( request: Request, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const resultado = idSchema.safeParse(id);

  if (!resultado.success) {
    return Response.json(
      {
        message: "Parâmetro inválido.",
        erros: resultado.error.issues,
      },
      { status: 400 }
    );
  }

  const autorId = resultado.data;

  const search = await getAutorId(autorId);

  if ("message" in search && "status" in search) {
    return Response.json(
      { message: search.message },
      { status: search.status }
    );
  }

  return Response.json(search);
}