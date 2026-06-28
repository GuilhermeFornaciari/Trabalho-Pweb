import { Biblioteca, Livro, StatusLeitura } from "@/lib/prisma/generated/client";
import LivroCard from "@/components/livro/livroCard"
import { statusStyle } from "@/lib/types/statusStyle";
import { Star } from "lucide-react";


type BibliotecaContainerProps = {
    livros: (Biblioteca & {
      livro: Livro;
      nota: number | null;
      paginaAtual: number | null;
    })[] | undefined;
}

export default function BibliotecaContainer({
  livros
}: BibliotecaContainerProps) {

  if(!livros || livros.length === 0) {
    return (
      <h1 className="text-center w-full">Não há livros adicionados na biblioteca ainda.</h1>
    )
  }

  return (
    <div className="w-5xl m-auto">
      {livros.map((elemento) => (
        <LivroCard key={elemento.livroId} livro={elemento.livro} imgBorder={statusStyle[elemento.status].border}>
          {cardConteudo(elemento)}
        </LivroCard>
      ))}
    </div>
  );
}

function cardConteudo(elemento: any) {
  console.log(elemento)
  if(elemento.status !== StatusLeitura.LENDO && elemento.status !== StatusLeitura.LIDO) {
    return ("")
  }
  
  if(elemento.status === StatusLeitura.LIDO) {
    return (
      <div className="flex justify-center items-center">
        {[1, 2, 3, 4, 5].map((valor) => (
          <Star
          key={valor}
          size={14}
          className={valor <= (elemento.nota ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
          />
        ))}
      </div>
    );
  }
}