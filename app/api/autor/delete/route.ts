import { createAutor } from "@/lib/data/autorDAO";
import Autor from "@/(entidades)/autor";

export async function DELETE(request: Request) {
  const req = await request.json();
  if(req.id) {
    const autor = new Autor(req.nome);
    autor.id = req.id;
    try {
      const res = await deleteAutor(autor);
      return Response.json(res);
    } catch(e) {
      console.log(e);
      return Response.json({message: "Não foi possível registrar o autor."});
    }
  } else {
    return Response.json({message: "Dados incompletos."})
  }
}