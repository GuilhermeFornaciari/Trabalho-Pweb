import { updateUser } from "@/lib/data/userDAO";
import { User } from "@/lib/prisma/generated/client";
import { z } from "zod";

const updateSchema = z.object({
  id:             z.string(),
  nome:           z.string().min(1),
  email:          z.string().email(),
  senha:          z.string().min(1),
  foto:           z.string(),
  emailVerified:  z.string().nullable().transform(v => v ? new Date(v) : null),
  bio:            z.string(),
  role:           z.string(),
  username:       z.string(),
  dataNascimento: z.string().nullable().transform(v => v ? new Date(v) : null),
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const usuario = updateSchema.safeParse(body);

    if (!usuario.success) {
      return Response.json(
        { erro: usuario.error.issues },
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
    
    console.log("abracadabra");
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