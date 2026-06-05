import { createUser } from "@/lib/service/register/RegisterService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, senha, nome } = body;

    const usuario = await createUser( email, senha, nome );

    if (!usuario) {
      return Response.json(
        { erro: "Não foi possível criar o usuário" },
        { status: 401 }
      );
    }

    return Response.json(
      usuario,
      { status: 201 }
    );

  } catch (error) {

    return Response.json(
      {erro: "Erro ao criar usuário"},
      {status: 500}
    );
  }
}