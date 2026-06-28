import { createUser } from "@/lib/service/RegisterService";
import { z } from "zod";

const createSchema = z.object({
  nome: z.string().min(1),
  email: z.email(),
  senha: z.string().min(1),
  username: z.string(),
})

export async function POST(request: Request) {
  const body = await request.json();
  const resultado = createSchema.safeParse(body);
  
  if (!resultado.success) {
    return Response.json(
      { erro: resultado.error.issues },
      { status: 400 }
    );
  }
  
  return Response.json(await createUser(resultado.data));
}