import { getLivros } from "@/lib/data/livroDAO";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const valor = searchParams.get("valor") ?? "";
  const filtro = searchParams.get("filtro") ?? "";
  if(filtro) {
    try{
      const res = await getLivros(valor, filtro);
      return Response.json(res);
    } catch(e) {
      return Response.json({message: 'Não foi possível realizar a busca.'});
    }
  } else {
    return Response.json({message: 'Parâmetros inválidos.'});
  }
}