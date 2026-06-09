import { getById } from "@/lib/service/livro/LivroService";

export async function GET(
  request: Request,
  { params } : {params: Promise<{id: string}>}
) {
  const {id} = await params;
  if(isNaN(Number(id))) {
    return Response.json({message: 'Parâmetro inválido.'});
  }
  const search = await getById(Number(id));
  if("message" in search) {
    return Response.json({
      message: search.message
    },
    {
      status: search.status
    }
  )
  }
  return Response.json(await getById(Number(id)));
}