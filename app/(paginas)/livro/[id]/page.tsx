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
  return(
    <div className="w-4xl my-5 p-5 m-auto flex border border-amber-300 rounded-md">
      <div className="me-5">
        <img src={livro.capa} alt="Capa" className="w-50 h-75 rounded-sm" />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="font-bold text-xl">{livro.titulo}</h1>
          <p>
            {livro.autores.map(a => a.nome)
                        .join(",")
                      }
          </p>
        </div>
        <div>
          <p>Gênero: {livro.genero}</p>
          <p>Páginas: {livro.paginas}</p>
          <p>Ano de lançamento da edição: {livro.ano}</p>
        </div>
      </div>
    </div>
  );
}