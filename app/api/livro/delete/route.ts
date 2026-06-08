import Livro from "@/(entidades)/livro";
import { deleteLivro } from "@/lib/data/livroDAO";


export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = Number(searchParams.get("id"));
  const colecaoId = searchParams.get("colecaoId");

      await deleteLivro( id, colecaoId ? Number(colecaoId) : null );

  return Response.json({ success: true });
}