import { createAutor } from "@/lib/data/autorDAO";
import Autor from "@/(entidades)/autor";

export async function POST(request: Request) {
  const req = await request.json();
  if(req.nome) {
    const autor = new Autor(req.nome);
    try {
      const res = await createAutor(autor);
      return Response.json(res);
    } catch(e) {
      console.log(e);
      return Response.json({message: "Não foi possível registrar o autor."});
    }
  } else {
    return Response.json({message: "Dados incompletos."})
  }
}