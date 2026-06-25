import { find } from "@/lib/data/userDAO";
import { z } from "zod";
// import { login } from "@/lib/service/login/LoginService";

const usuarioID = z.string();

export async function GET( request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } =await params; // precisa de awiat e n sei pq
    const resultado = usuarioID.safeParse(id);
    
    if (!resultado.success) {
      return Response.json(
        { erro: resultado.error.issues},
        { status: 400 }
      );
    }
    // console.log("aaaaaaaaa");
    
    const idret  = resultado.data;

    const usuario = await find(idret);

    if (!usuario) {
        // console.log(resultado.error); // objeto completo do Zod
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