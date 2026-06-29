import { z } from "zod";
import { Comentario } from "@/lib/prisma/generated/client";
import { upsertComentario } from "@/lib/data/comentarioDAO"; 

const upsertSchema = z.object({
  postagemId: z.coerce.number().int().positive(),
  usuarioId: z.string(),
  texto: z.string().min(1),
  parentId: z.coerce.number().int().positive().nullable().optional(), // Para respostas
  idComentarioSendoEditado: z.coerce.number().int().positive().nullable().optional(), // Para edições
});

export async function POST(request: Request) {
  try {
    const req = await request.json();
    const resultado = upsertSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 411 }
      );
    }

  const dados = resultado.data;

  // Monta a estrutura padrão exigida pelo Omit<Comentario, "id" | "createdAt">
  const dadosComentario: Omit<Comentario, "id" | "createdAt"> = {
    postagemId: dados.postagemId,
    usuarioId: dados.usuarioId,
    texto: dados.texto,
    data: new Date(),
    parentId: dados.parentId ?? null,
  };

  // Chama o DAO passando os dados e o ID de edição (se houver)
  const idEdicao = dados.idComentarioSendoEditado ?? undefined;
  const res = await upsertComentario(dadosComentario, idEdicao);

  // Retorna 200 (OK) se foi edição ou 201 (Created) se foi criação
  const status = idEdicao ? 200 : 201;
  return Response.json(res, { status });

  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "Não foi possível processar o comentário." },
      { status: 500 }
    );
  }
}