import {  updateLivro } from "@/lib/data/livroDAO";
import Livro from "@/(entidades)/livro";


// criar um service depois
export async function PUT(request: Request) {
  const req = await request.json();

  if(req.titulo && req.ano && req.genero && req.paginas && req.capa && req.autores) {
    const livro = new Livro(req.titulo, Number(req.ano), req.genero, Number(req.paginas), req.capa, req.autores);
    try {
      const res = await updateLivro(livro);
      return Response.json(res);
    } catch(e) {
      console.log(e);
      return Response.json({message: "Não foi possível registrar o livro."});
    }
  } else {
    return Response.json({message: "Falta dados necessários para o efetuar o registro."});
  }
}