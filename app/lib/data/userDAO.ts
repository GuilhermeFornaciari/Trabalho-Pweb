import { User } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";

const prisma = PrismaSingleton.getInstance().prismaClient;

export async function create(data: {
  email: string,
  senha: string, 
  nome: string, 
  username: string
}) {
  return await prisma.user.create({ 
    data: {
      email: data.email, 
      senha: data.senha, 
      nome: data.nome, 
      username: data.username,
      foto: "",
      bio: ""
    }
  });
}

export async function find(id: string){
  const user = await prisma.user.findUnique({
    select: {
      id: true,
      nome: true,
      email: true,
      foto: true,
      bio: true,
      dataNascimento: true,
      role: true,
      username: true,
      senha: true
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
      dataNascimento: true,
      username: true,
      biblioteca: {
        include: {
          livro: true
        }
      }
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