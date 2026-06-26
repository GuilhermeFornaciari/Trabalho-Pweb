import { User } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function create(email: string, senha: string, nome: string, foto:string, username: string, bio: string){
    const prisma = PrismaSingleton.getInstance().prismaClient.user;
    const data = ({ email, senha,  nome, foto, username, bio })
    return prisma.create({ data });
}

export async function find(id: string){
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      nome: true,
      email: true,
      foto: true,
      bio: true,
      role: true,
      username: true
    },
    where: { id },
  });
  
  return user;
}

export async function findByUsername(username: string){
  console.log("username recebido:", username);
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      nome: true,
      email: true,
      foto: true,
      bio: true,
      role: true,
      username: true
    },
    where: { username: username },
  });
  
  return user;
}

export async function updateUser(user: User) {
    const opa  = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        nome: user.nome,
        email: user.email,
        foto: user.foto,
        bio: user.bio,
        username: user.username,
        dataNascimento: user.dataNascimento
      },
    });
    
    console.log(JSON.stringify(opa));

    return opa;

}