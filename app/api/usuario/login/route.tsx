import { login } from "@/lib/service/login/LoginService";


export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, senha } = body;

    const usuario = await login(email, senha);

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