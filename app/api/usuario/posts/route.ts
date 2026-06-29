import { auth } from "@/lib/auth";
import { z } from "zod";
import { buscarPostagensDoUsuario } from "@/lib/service/UsuarioService";

const feedSchema = z.object({
  usuarioId: z.string().min(1),
  pagina: z.coerce.number().int().positive(),
  quantidade: z.coerce.number().int().positive().optional(),
});

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user.id) {
    return Response.json(
      { message: "Não autorizado: usuário não logado." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);

  const resultado = feedSchema.safeParse({
    usuarioId: searchParams.get("usuarioId"),
    pagina: searchParams.get("pagina") ?? undefined,
    quantidade: searchParams.get("quantidade") ?? undefined,
  });

  if (!resultado.success) {
    return Response.json(
      { erro: resultado.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { usuarioId, pagina, quantidade } = resultado.data;

  return Response.json(await buscarPostagensDoUsuario(usuarioId, pagina, quantidade));
}