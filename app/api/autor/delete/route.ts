import Autor from "@/(entidades)/autor";
import { deleteAutor } from "@/lib/data/autorDAO";
import z from "zod";

const deleteSchema = z.coerce.number().int().positive();

export async function DELETE(request: Request) {

  try{

    const { searchParams } = new URL(request.url);
    
    const resultado = deleteSchema.safeParse(searchParams.get("id"));

    if (!resultado.success) {
      return Response.json(
        { erros: resultado.error.issues },
        { status: 400 }
      );
    }
    
    
    const id = resultado.data;    
    
    await deleteAutor({ id } as Autor);
    
    return Response.json(
      { success: true },
      { status: 200 }
    );
  }catch (e){
    return Response.json(
      { message: "Erro ao excluir livro." },
      { status: 500 }
    );
  }
}