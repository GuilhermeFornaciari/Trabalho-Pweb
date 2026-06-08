export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = Number(searchParams.get("id"));

  await deleteColecao(id);

  return Response.json({ success: true });
}