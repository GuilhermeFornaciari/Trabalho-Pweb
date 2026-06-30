import { updateUser } from "@/lib/data/userDAO";
import { z } from "zod";

const updateSchema = z.object({
  id:             z.string(),
  nome:           z.string().min(1),
  email:          z.email(),
  foto:           z.string(),
  bio:            z.string(),
  role:           z.string(),
  username:       z.string(),
  dataNascimento: z.string().nullable().optional().transform(v => v ? new Date(v) : null),
  senha:          z.string().optional(), 
});

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validacao = updateSchema.safeParse(body);

    if (!validacao.success) {
      return Response.json(
        { erro: validacao.error.issues },
        { status: 400 }
      );
    }

    const { id, ...dadosParaBanco } = validacao.data;

    if (dadosParaBanco.senha === "") {
      delete dadosParaBanco.senha;
    }

    const resultado = await updateUser(id, dadosParaBanco);
    
    if (!resultado) {
      return Response.json(
        { erro: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    
    const { senha: _, ...usuarioSemSenha } = resultado; // oculta hash da senha 

    return Response.json(usuarioSemSenha, { status: 200 });

  } catch (error) {
    console.error(error);
    return Response.json(
      { erro: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}