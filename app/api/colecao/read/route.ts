import { searchColecoes } from "@/lib/data/colecaoDAO";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const nome = searchParams.get("nome") ?? "";

    try{
      const res = await searchColecoes(nome);
      return Response.json(res);
    } catch(e) {
      return Response.json({message: 'Não foi possível realizar a busca de colecoes.'});
    }
  
}