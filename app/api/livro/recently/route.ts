import { livrosRecentes } from "@/lib/service/livro/LivroService";

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const quantidade = searchParams.get("quantidade") ?? 10;
  if(isNaN(Number(quantidade)) || Number(quantidade) === 0) {
    return Response.json({status:400, message: `O valor informado como parâmetro é inválido`})
  }
  return Response.json(await livrosRecentes(Number(quantidade)));
}