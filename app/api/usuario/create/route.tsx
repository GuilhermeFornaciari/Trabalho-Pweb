import { createUser } from "@/lib/service/register/RegisterService";
import { z } from "zod";

const createSchema = z.object({
  nome: z.string().min(1),
  email: z.email(),
  senha: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json();

    
    const resultado = createSchema.safeParse(body);
    
    if (!resultado.success) {
      return Response.json(
        { erro: z.treeifyError(resultado.error) },
        { status: 400 }
      );
    }
    
    const { email, senha, nome } = resultado.data;

    const usuario = await createUser( email, senha, nome );

    if (!usuario) {
      return Response.json(
        { erro: "Não foi possível criar o usuário" },
        { status: 401 }
      );
    }

    return Response.json(
      usuario,
      { status: 201 }
    );

  } catch (error) {

    return Response.json(
      {erro: "Erro ao criar usuário"},
      {status: 500}
    );
  }
}