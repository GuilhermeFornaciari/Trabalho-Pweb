import { updateUser } from "@/lib/data/userDAO";
import { User } from "@/lib/prisma/generated/client";


export async function PUT(request: Request) {
  try {
    const body : User = await request.json();

    const usuario = await updateUser(body);

    if (!usuario) {
      return Response.json(
        { erro: "Credenciais inválidas" },
        { status: 401 }
      );
    }
    return Response.json(
      usuario,
      { status: 201 }
    );

  } catch (error) {
    
    return Response.json(
      {erro: "Erro ao Buscar usuário"},
      {status: 500}
    );
  }
}