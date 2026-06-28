import { getById } from "@/lib/service/colecao/ColecaoService";
import { z } from "zod";

const idSchema = z.coerce.number().int().positive();

export async function GET( request: Request,{ params }: { params: Promise<{ id: string }> } ) { 
  const { id } = await params;
  const resultado = idSchema.safeParse(id);

  if (!resultado.success) {
    return Response.json(
      { message: "Parâmetro inválido.", erros: resultado.error.issues },
      { status: 400 }
    );
  }

  const colecaoId = resultado.data;

  const search = await getById(colecaoId);

  if ("message" in search) {
    return Response.json(
      { message: search.message },
      { status: search.status }
    );
  }

  return Response.json(search);
}