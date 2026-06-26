import { buscarPostagensFeed } from "@/lib/data/feedDAO";

export async function GET(request: Request) {
  try {
    // Busca as postagens estruturadas com os includes do Prisma
    const postagens = await buscarPostagensFeed();

    return Response.json(postagens);
  } catch (e) {
    console.error("Erro ao buscar feed:", e);
    return Response.json(
      { message: "Não foi possível realizar a busca do feed." },
      { status: 500 }
    );
  }
}