import { getLivroById } from "@/lib/data/livroDAO";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = Number(searchParams.get("id"));
  
  if(id) {
    try{
      const res = await getLivroById(id);
      return Response.json(res);
    } catch(e) {
      return Response.json({message: 'Não foi possível realizar a busca.'});
    }
  } else {
    return Response.json({message: 'Parâmetros inválidos.'});
  }
}