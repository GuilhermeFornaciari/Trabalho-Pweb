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

export async function updateUser(id: string, dados: Partial<User>) {
  const usuarioAtualizado = await prisma.user.update({
    where: {
      id: id,
    },
    data: dados, 
  });

  return usuarioAtualizado;
}

export async function getUserPosts(
  user: string,
  pagina: number = 1,
  quantidade: number = 10
) {
  const [dados, total] = await Promise.all([
    prisma.postagem.findMany({
      where: {
        usuarioId: user,
      },

      orderBy: [
        { data: "desc" },
        { id: "desc" },
      ],

      skip: (pagina - 1) * quantidade,
      take: quantidade,

      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            username: true,
            foto: true,
          },
        },

        livro: {
          select: {
            id: true,
            titulo: true,
            capa: true,
            paginas: true,
            autores: {
              include: {
                autor: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
          },
        },

        curtidas: true,

        comentarios: {
          include: {
            curtidas: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                username: true,
                foto: true,
              },
            },
          },
          orderBy: {
            data: "asc",
          },
        },
      },
    }),

    prisma.postagem.count({
      where: {
        usuarioId: user,
      },
    }),
  ]);

  return {
    posts: dados,
    total,
    totalPaginas: Math.ceil(total / quantidade),
    paginaAtual: pagina
  };
}

export async function deleteUser(usuarioId: string){
  return prisma.user.delete({
    where: {
      id: usuarioId,
    }
  })
}