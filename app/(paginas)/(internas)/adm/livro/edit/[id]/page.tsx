'use client'

import { use } from "react";
import Header from "@/components/header";

export default function DetalhesLivro({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = use(params);
  return (  
    <div className="flex flex-col flex-1 items-center justify-center h-full p-10">
      <h1 className="text-slate-700 text-3xl font-semibold mb-3">Editar livro</h1>
    </div>
  )
}