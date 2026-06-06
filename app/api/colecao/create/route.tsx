import { colecao } from "@/lib/service/colecao/ColecaoService";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nome, livros } = body;

    const usuario = await colecao( nome, livros );

    if (!usuario) {
      return Response.json(
        { erro: "Não foi possível criar a coleção" },
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