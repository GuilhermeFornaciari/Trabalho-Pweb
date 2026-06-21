import { createLivro } from "@/lib/data/livroDAO";
import Livro from "@/(entidades)/livro";
import { z } from "zod";

const createSchema = z.object({
  titulo: z.string().min(1),
  ano: z.coerce.number(),
  genero: z.string().min(1),
  paginas: z.coerce.number().positive(),
  capa: z.string().min(1),
  autores: z.array(z.coerce.number()).min(1),
  sinopse: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const resultado = createSchema.safeParse(req);

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

    const res = await createLivro(livro);

    return Response.json(res, { status: 201 });

  } catch (e) {
    console.error(e);

    return Response.json(
      { message: "Não foi possível registrar o livro." },
      { status: 500 }
    );
  }
}