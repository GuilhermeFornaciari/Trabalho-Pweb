import Autor from "@/(entidades)/autor";
import { updateAutor } from "@/lib/data/autorDAO";

export async function PUT(request: Request) {
  const req = await request.json();
  if(req.nome && req.id) {
    const autor = new Autor(req.nome);
    autor.id = req.id;
    try {
      const res = await updateAutor(autor);
      return Response.json(res);
    } catch(e) {
      console.log(e);
      return Response.json({message: "Não foi possível registrar o autor."});
    }
  } else {
    return Response.json({message: "Dados incompletos."})
  }
}