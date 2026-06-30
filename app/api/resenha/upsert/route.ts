import { z } from "zod";
import { upsertResenha } from "@/lib/data/postagemDAO"; 

const upsertSchema = z.object({
  id: z.coerce.number().int().positive().optional(), 
  livroId: z.coerce.number().int().positive(),
  usuarioId: z.string(),
  titulo: z.string(),
  texto: z.string(),
  nota: z.number().int().min(0).max(5),
  spoiler: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const resultado = upsertSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 } 
      );
    }

    const dados = resultado.data;

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