import Autor from "@/(entidades)/autor";
import { deleteAutor } from "@/lib/data/autorDAO";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = Number(searchParams.get("id"));

  await deleteAutor({ id } as Autor);

  return Response.json({ success: true });
}