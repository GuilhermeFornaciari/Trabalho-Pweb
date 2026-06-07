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
    <div>
      <h1>{livro.titulo}</h1>
      <img src={livro.capa} alt="Capa" />
    </div>
  );
}