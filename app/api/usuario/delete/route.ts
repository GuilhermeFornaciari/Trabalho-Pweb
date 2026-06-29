import { deleteUser } from "@/lib/data/userDAO";
import { z } from "zod";

const createSchema = z.object({
  usuarioId: z.string(),
});

export async function DELETE(request: Request) {
  try {
    const req = await request.json();

    const resultado = createSchema.safeParse(req);

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }

    const { usuarioId } = resultado.data;

    const res = await deleteUser(usuarioId);
    
    return Response.json(res, { status: 201 });


  } catch(e){
    console.error(e);

        return Response.json(
      { message: "Não foi possível registrar o livro." },
      { status: 500 }
    );
  }
}