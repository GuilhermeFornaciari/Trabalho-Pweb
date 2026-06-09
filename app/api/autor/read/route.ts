import { getAutores } from "@/lib/service/autor/AutorService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nome = searchParams.get('nome');
  if(nome && !(nome.trim().length === 0)) {
    const res = await getAutores(nome);
    return Response.json(res);
  }

  return Response.json({message: 'Nome do autor não informado.'});
}