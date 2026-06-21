import { searchColecoes } from "@/lib/data/colecaoDAO";
import { z } from "zod";

const readSchema = z.string().default("");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const resultado = readSchema.safeParse(searchParams.get("nome") ?? "");

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const nome  = resultado.data;

    const res = await searchColecoes(nome);

    return Response.json(res);

  } catch (e) {
    return Response.json(
      { message: "Não foi possível realizar a busca de coleções." },
      { status: 500 }
    );
  }
}