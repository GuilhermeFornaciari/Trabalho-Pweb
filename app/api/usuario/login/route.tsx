import { z } from "zod";
import { login } from "@/lib/service/login/LoginService";

const loginSchema = z.object({
  email: z.email(),
  senha: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    
    const resultado = loginSchema.safeParse(body);
    
    if (!resultado.success) {
      return Response.json(
        { erro: z.treeifyError(resultado.error) },
        { status: 400 }
      );
    }
    console.log("aaaaaaaaa");
    
    const { email, senha } = resultado.data;

    const usuario = await login(email, senha);

    if (!usuario) {
        console.log(resultado.error); // objeto completo do Zod
        // console.log(resultado.error.issues); // lista detalhada dos erros
      return Response.json(
        { erro: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    return Response.json(usuario, { status: 200 });

  } catch (error) {
    return Response.json(
      { erro: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}