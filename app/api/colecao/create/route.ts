import { colecao } from "@/lib/service/ColecaoService";
import { z } from "zod";

const createSchema = z.object({
  nome: z.string().min(1),
  livros: z.array(
    z.object({
      id: z.coerce.number().int().positive(),
      posicao: z.coerce.number().int().min(0),
    })
  ).default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const resultado = createSchema.safeParse(body);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { nome, livros } = resultado.data;

    const novaColecao = await colecao(nome, livros);

    return Response.json(novaColecao, { status: 201 });

  } catch (error) {
    return Response.json(
      { erro: "Erro ao criar coleção" },
      { status: 500 }
    );
  }
}