'use client'

import { use, useEffect, useState } from "react";
import { Livro } from "@/lib/prisma/generated/client";

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
  }, []);
  
  return (  
    <div className="flex flex-col flex-1 items-center justify-center h-full p-10">
      <h1 className="text-slate-700 text-3xl font-semibold mb-3">Editar livro</h1>
    </div>
  )
}