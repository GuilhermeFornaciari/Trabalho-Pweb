import { Biblioteca, Livro } from "@/lib/prisma/generated/client";

export default function BibliotecaContainer({
  livros,
}: {
  livros: (Biblioteca & {
      livro: Livro;
    })[];
}) {

  if(!livros || livros.length === 0) {
    return (
      <h1>Não há livros adicionados na biblioteca ainda</h1>
    )
  }

  return (
    <h1>Hello World!</h1>
  )
}