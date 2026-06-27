import { getById } from "@/lib/service/ColecaoService";
import { z } from "zod";

const idSchema = z.coerce.number().int().positive();

export async function GET( request: Request,{ params }: { params: { id: string } } ) { 
  const resultado = idSchema.safeParse(params.id);

  if (!resultado.success) {
    return Response.json(
      { message: "Parâmetro inválido.", erros: resultado.error.issues },
      { status: 400 }
    );
  }

  const id = resultado.data;

  const search = await getById(id);

  if ("message" in search) {
    return Response.json(
      { message: search.message },
      { status: search.status }
    );
  }

  return Response.json(search);
}