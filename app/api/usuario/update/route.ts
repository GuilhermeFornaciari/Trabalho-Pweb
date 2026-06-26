import { updateUser } from "@/lib/data/userDAO";
import { User } from "@/lib/prisma/generated/client";
import { z } from "zod";

const updateSchema = z.object({
  id:             z.string(),
  nome:           z.string().min(1),
  email:          z.string().email(),
  foto:           z.string(),
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
    
    const user: User = {
      id: usuario.data.id,
      nome: usuario.data.nome,
      email: usuario.data.email,
      foto: usuario.data.foto,
      bio: usuario.data.bio,
      role: usuario.data.role,
      username: usuario.data.username,
      dataNascimento: usuario.data.dataNascimento,
      emailVerified: null,
      senha: ''
    }
    const resultado = await updateUser(user);
    
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