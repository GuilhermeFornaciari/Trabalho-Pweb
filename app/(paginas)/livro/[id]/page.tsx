'use client'

import { use, useEffect, useState } from "react";
import { Livro } from "@/lib/prisma/generated/client";
import Header from "@/components/header";

type LivroDetalhes = Livro & {
  autores: Array<{id: number, nome: string}> 
}

export default function DetalhesLivro({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = use(params);
  const [livro, setLivro] = useState<LivroDetalhes | null>(null);

  useEffect(() => {
    const carregarLivro = async () => {
      const response = await fetch(`/api/livro/${id}`);
      if(response.ok) {
        const data = await response.json();
        setLivro(data);
      }
    }
    carregarLivro();
  }, [])

  
  return(
    <div className="min-h-screen bg-olive-50">
      <Header></Header>
      {(livro) ? informacoesDoLivro(livro) : ''}
    </div>
  );
}

function informacoesDoLivro(livro: LivroDetalhes) {
  const spanStyle = "font-semibold";
  return(
    <div className="w-4xl my-5 p-5 m-auto flex border border-amber-300 rounded-md">
      <div className="me-5">
        <img src={livro.capa} alt="Capa" className="w-50 h-75 rounded-sm" />
      </div>
      <div className="w-1/2 flex flex-col flex-1 justify-between">
        <div>
          <h1 className="font-bold text-xl">{livro.titulo}</h1>
          <p>
            {livro.autores.map(a => a.nome)
                        .join(",")
                      }
          </p>
        </div>
        <div className="my-5">
          <h2 className="font-semibold">Sinopse:</h2>
          <p className="text-ellipsis overflow-hidden">{livro.sinopse}</p>
        </div>
        <div>
          <p><span className={spanStyle}>Gênero:</span> {livro.genero}</p>
          <p><span className={spanStyle}>Páginas:</span> {livro.paginas}</p>
          <p><span className={spanStyle}>Ano de lançamento da edição:</span> {livro.ano}</p>
        </div>
      </div>
    </div>
  );
}