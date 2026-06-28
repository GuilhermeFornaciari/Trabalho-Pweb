import { auth } from "@/lib/auth";
import PrismaSingleton from "@/lib/prisma/PrismaSingleton";
import { z } from "zod";

const prisma = PrismaSingleton.getInstance().prismaClient;

const amigoSchema = z.object({
  usuarioId: z.string().min(1, "Selecione um usuário"),
});

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("search")?.trim() ?? "";

  if (query) {
    const usuarios = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { nome: { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
            ],
          },
          { id: { not: session.user.id } },
        ],
      },
      select: {
        id: true,
        nome: true,
        username: true,
        foto: true,
      },
      take: 10,
      orderBy: { nome: "asc" },
    });

    const relacoes = await prisma.amigos.findMany({
      where: {
        OR: [
          { amigo1Id: session.user.id },
          { amigo2Id: session.user.id },
        ],
      },
      select: {
        amigo1Id: true,
        amigo2Id: true,
      },
    });

    const amigosIds = new Set(
      relacoes.map((relacao) =>
        relacao.amigo1Id === session.user.id ? relacao.amigo2Id : relacao.amigo1Id
      )
    );

    return Response.json(
      usuarios.map((usuario) => ({
        ...usuario,
        isFriend: amigosIds.has(usuario.id),
      }))
    );
  }

  const amizades = await prisma.amigos.findMany({
    where: {
      OR: [
        { amigo1Id: session.user.id },
        { amigo2Id: session.user.id },
      ],
    },
    select: {
      amigo1Id: true,
      amigo2Id: true,
      amigo1: {
        select: {
          id: true,
          nome: true,
          username: true,
          foto: true,
        },
      },
      amigo2: {
        select: {
          id: true,
          nome: true,
          username: true,
          foto: true,
        },
      },
    },
  });

  const listaAmigos = amizades.map((relacao) =>
    relacao.amigo1Id === session.user.id ? relacao.amigo2 : relacao.amigo1
  );

  return Response.json({ amigos: listaAmigos });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const validaDados = amigoSchema.safeParse(body);

  if (!validaDados.success) {
    return Response.json(
      { message: "Dados inválidos", erros: validaDados.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { usuarioId } = validaDados.data;

  if (usuarioId === session.user.id) {
    return Response.json({ message: "Você não pode adicionar a si mesmo" }, { status: 400 });
  }

  const destino = await prisma.user.findUnique({
    where: { id: usuarioId },
    select: { id: true },
  });

  if (!destino) {
    return Response.json({ message: "Usuário não encontrado" }, { status: 404 });
  }

  const amizadeExistente = await prisma.amigos.findFirst({
    where: {
      OR: [
        { amigo1Id: session.user.id, amigo2Id: usuarioId },
        { amigo1Id: usuarioId, amigo2Id: session.user.id },
      ],
    },
  });

  if (amizadeExistente) {
    return Response.json({ message: "Este usuário já está na sua lista de amigos" }, { status: 200 });
  }

  const amizade = await prisma.amigos.create({
    data: {
      amigo1Id: session.user.id,
      amigo2Id: usuarioId,
    },
  });

  return Response.json({ message: "Amigo adicionado com sucesso", amizade }, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const validaDados = amigoSchema.safeParse(body);

  if (!validaDados.success) {
    return Response.json(
      { message: "Dados inválidos", erros: validaDados.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { usuarioId } = validaDados.data;

  if (usuarioId === session.user.id) {
    return Response.json({ message: "Você não pode desfazer amizade consigo mesmo" }, { status: 400 });
  }

  const amizadeExistente = await prisma.amigos.findFirst({
    where: {
      OR: [
        { amigo1Id: session.user.id, amigo2Id: usuarioId },
        { amigo1Id: usuarioId, amigo2Id: session.user.id },
      ],
    },
  });

  if (!amizadeExistente) {
    return Response.json({ message: "Este usuário não está na sua lista de amigos" }, { status: 404 });
  }

  await prisma.amigos.delete({
    where: {
      amigo1Id_amigo2Id: {
        amigo1Id: amizadeExistente.amigo1Id,
        amigo2Id: amizadeExistente.amigo2Id,
      },
    },
  });

  return Response.json({ message: "Amizade desfeita com sucesso" }, { status: 200 });
}
