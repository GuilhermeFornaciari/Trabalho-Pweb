import { getAutores } from "@/lib/service/AutorService";
import { z } from "zod";

const readSchema = z.string().min(1);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resultado = readSchema.safeParse(searchParams.get("nome"));

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }
    
    const nome = resultado.data;
    
    const res = await getAutores(nome);

    return Response.json(res);
    
  } catch(e) {
    return Response.json(
      { message: "Erro ao read livro." },
      { status: 500 }
    );
  }
}