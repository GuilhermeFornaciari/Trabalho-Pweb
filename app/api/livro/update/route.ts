import { updateLivro } from "@/lib/data/livroDAO";
import Livro from "@/(entidades)/livro";
import { z } from "zod";

const livroSchema = z.object({
  id: z.number(),
  titulo: z.string().min(1),
  ano: z.number(),
  genero: z.string().min(1),
  paginas: z.number().positive(),
  capa: z.string().min(1),
  autores: z.array(z.number()).min(1), 
  sinopse: z.string().min(1),
});

export async function PUT(request: Request) {
  try {
    const req = await request.json();

    const resultado = livroSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const dados = resultado.data;

    const livro = new Livro(
      dados.titulo,
      dados.ano,
      dados.genero,
      dados.paginas,
      dados.capa,
      dados.autores,
      dados.sinopse
    );

    livro.id = dados.id;

    const res = await updateLivro(livro);

    return Response.json(res, { status: 200 });

  } catch (e) {
    console.error(e);

    return Response.json(
      { message: "Não foi possível atualizar o livro." },
      { status: 500 }
    );
  }
}