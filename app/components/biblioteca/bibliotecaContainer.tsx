import { Biblioteca, Livro } from "@/lib/prisma/generated/client";
import LivroCard from "@/components/livro/livroCard"
import { statusStyle } from "@/lib/types/statusStyle";

export default function BibliotecaContainer({
  livros,
}: {
  livros: (Biblioteca & {
      livro: Livro;
    })[] | undefined;
}) {

  if(!livros || livros.length === 0) {
    return (
      <h1>Não há livros adicionados na biblioteca ainda</h1>
    )
  }

  return (
    <>
      {livros.map((elemento) => (
        <LivroCard key={elemento.livroId} livro={elemento.livro} imgBorder={statusStyle[elemento.status].border}></LivroCard>
      ))}
    </>
  );
}