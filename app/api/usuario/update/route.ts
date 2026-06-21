import { updateUser } from "@/lib/data/userDAO";
import { z } from "zod";

const updateSchema = z.object({
  id: z.number(),
  nome: z.string().min(1),
  email: z.email(),
  senha: z.string().min(1),
  foto: z.string(),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const usuario = updateSchema.safeParse(body);

    if (!usuario.success) {
      return Response.json(
        { erro: z.treeifyError(usuario.error) },
        { status: 400 }
      );
    }

    const resultado = await updateUser(usuario.data);

    if (!resultado) {
      return Response.json(
        { erro: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return Response.json(resultado, {
      status: 200,
    });

  } catch (error) {
    return Response.json(
      { erro: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}