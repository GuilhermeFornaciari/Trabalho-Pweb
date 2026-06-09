import { updateColecao } from "@/lib/data/colecaoDAO";

export async function PUT(request: Request) {
  console.log("PUT")
  const req = await request.json();

  if(req.id && req.nome && req.livros) {
    try {
      const res = await updateColecao(Number(req.id), req.nome, req.livros);
      return Response.json(res);
    } catch(e) {
      console.log(e);
      return Response.json({message: "Não foi possível registrar o livro."}, { status: 500 });
    }
  } else {
    return Response.json({message: "Falta dados necessários para o efetuar o registro."}, { status: 400 });
  }
}