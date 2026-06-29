import { z } from "zod";
import { Postagem } from "@/lib/prisma/generated/client";
import { upsertResenha } from "@/lib/data/postagemDAO"; // Nome alterado para refletir a nova lógica

const upsertSchema = z.object({
  id: z.coerce.number().int().positive().optional(), // ID opcional para update
  livroId: z.coerce.number().int().positive(),
  usuarioId: z.string(),
  titulo: z.string(),
  texto: z.string(),
  nota: z.number().int().min(0).max(5), // Corrigido z.int() para z.number().int()
  spoiler: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const resultado = upsertSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 } // Status corrigido de 411 para 400 (Bad Request)
      );
    }

    const dados = resultado.data;

    // Monta o objeto base sem o ID
    const dadosPostagem = {
      livroId: dados.livroId,
      usuarioId: dados.usuarioId,
      titulo: dados.titulo,
      texto: dados.texto,
      nota: dados.nota,
      temSpoiler: dados.spoiler,
      data: new Date(),
      paginaAtual: null,
      paginasLidas: null,
    };

    // Executa a função passando o ID (se houver) e os dados
    const res = await upsertResenha(dados.id, dadosPostagem);

    // Retorna 200 se foi atualização (dados.id existe) ou 201 se foi criação
    const statusResult = dados.id ? 200 : 201;
    return Response.json(res, { status: statusResult });

  } catch (e) {
    console.error(e);

    return Response.json(
      { message: "Não foi possível salvar a resenha." },
      { status: 500 }
    );
  }
}