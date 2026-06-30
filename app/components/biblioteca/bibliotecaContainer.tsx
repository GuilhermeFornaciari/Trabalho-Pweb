import { Biblioteca, Livro, StatusLeitura } from "@/lib/prisma/generated/client";
import LivroCard from "@/components/livro/livroCard";
import { statusStyle } from "@/lib/types/statusStyle";
import { Star } from "lucide-react";

import Link from "next/link"; 

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
        <Link 
          key={elemento.livroId} 
          href={`/livro/${elemento.livro.id}`}
          className="block transition-transform hover:scale-[1.01]" // pra ficar bonito
        >
          <LivroCard livro={elemento.livro} imgBorder={statusStyle[elemento.status].border}>
            {cardConteudo(elemento)}
          </LivroCard>
        </Link>
      ))}
    </div>
  );
}

function cardConteudo(elemento: any) {
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
  
  const paginas = elemento.paginaAtual ?? 0;
  const porcentagem = Math.min(
    Math.round((paginas / elemento.livro.paginas) * 100),
    100
  );

  if(elemento.status === StatusLeitura.LENDO) {
    return (
      <div className="flex justify-between items-center">
        <div className="flex-1 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-yellow-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
        <p className="pl-2">{porcentagem + "%"}</p>
      </div>
    )
  }
}