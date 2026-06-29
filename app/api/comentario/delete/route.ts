import { deleteComent } from "@/lib/data/comentarioDAO";
import { z } from "zod";

const createSchema = z.object({
  comentarioId: z.coerce.number().int().positive(),
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

    const { comentarioId } = resultado.data;

    const res = await deleteComent(comentarioId);
    
    return Response.json(res, { status: 201 });


  } catch(e){
    console.error(e);

        return Response.json(
      { message: "Não foi possível apagar o comnetario." },
      { status: 500 }
    );
  }
}