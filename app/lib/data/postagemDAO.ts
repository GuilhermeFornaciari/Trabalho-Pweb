import { Postagem } from "../prisma/generated/client";
import PrismaSingleton from "../prisma/PrismaSingleton";
import { sincronizarBiblioteca } from "./bibliotecaDAO";


const prisma = PrismaSingleton.getInstance().prismaClient;

export async function find(postId: number) {
  return prisma.postagem.findUnique({
    where: {
      id: postId
    }
  })
}

export async function deletePost(post: Postagem, usuarioId: string, livroId: number) {
  return await prisma.$transaction(async (tx) => {
    const proximoPost = await tx.postagem.findFirst({
      where: {
        usuarioId: usuarioId,
        livroId: livroId,
        paginaAtual: {
          not: null,
        },
        id: {
          not: post.id,
        },
      },
      orderBy: {
        data: "desc",
      },
    });


    if(proximoPost) {
      await tx.postagem.update({
        where: {
          id: proximoPost.id,
        },
          data: {
          paginasLidas: {
            increment: post.paginasLidas ?? 0,
          },
        },
      });
    }

    
    const result = await tx.postagem.delete({
      where: {
        id: post.id,
      },
    });

    await sincronizarBiblioteca(tx, usuarioId, livroId);
    return result;
  })

}

export async function upsertResenha(id: number | undefined, resenha: Omit<Postagem, "id">) {
  return prisma.$transaction(async (tx) => {
    const postagemId = id ?? -1;

    const postagem = await tx.postagem.upsert({
      where: {
        id: postagemId,
      },
      update: {
        titulo: resenha.titulo,
        texto: resenha.texto,
        nota: resenha.nota,
        temSpoiler: resenha.temSpoiler,
        // Opcional: remover ou manter a data original. 
        // Se quiser atualizar a data da resenha para a data da edição, descomente a linha abaixo:
        // data: resenha.data 
      },
      create: resenha,
    });

    // Mantém a sincronização da biblioteca em ambos os casos
    await sincronizarBiblioteca(tx, resenha.usuarioId, resenha.livroId);
    
    return postagem;
  });
}

export async function createProgresso(progresso: Omit<Postagem, "id">) {
  return prisma.$transaction(async (tx) => {
    const postagem = await tx.postagem.create({
      data: progresso,
    })

    await sincronizarBiblioteca(tx, progresso.usuarioId, progresso.livroId);
    return postagem;
  })
}


export async function livrosResenhasRecentes(livroId: number, pagina: number, limite = 10) {
  const where = {
    livroId,
    nota: {
      not: null,
    },
  };

  const [dados, total] = await Promise.all([
    prisma.postagem.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            username: true,
            foto: true,
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
      orderBy: {
        data: "desc",
      },
      skip: (pagina - 1) * limite,
      take: limite,
    }),

    prisma.postagem.count({
      where,
    }),
  ]);

  
  return {
    resenhas: dados, 
    total,
    totalPaginas: Math.ceil(total / limite),
    paginaAtual: pagina,
  };
}

export async function ultimoProgresso(usuarioId: string, livroId: number) {
  return await prisma.postagem.findFirst({
    where: {
      usuarioId: usuarioId,
      livroId: livroId,
      paginaAtual: {
        not: null,
      }
    },
    orderBy: {
      data: "desc"
    }
  })
}

export async function updateProgresso(
  usuarioId: string,
  dados: {
    postId: number;
    texto?: string;
    temSpoiler: boolean;
  }
) {
  const data = {
    temSpoiler: dados.temSpoiler,
    ...(dados.texto !== undefined && { texto: dados.texto }),
  };

  return await prisma.postagem.update({
    where: {
      id: dados.postId,
      usuarioId,
    },
    data,
  });
}