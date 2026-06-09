'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { Livro } from "@/lib/prisma/generated/client";

type LivroCatalogo = Livro & {
  autores: Array<{id: number, nome: string}> 
};

export default function CatalogoPage() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("ano");
  const [livros, setLivros] = useState<LivroCatalogo[]>([]);
  const [livrosRecentes, setLivrosRecentes] = useState<LivroCatalogo[]>([]);

  useEffect(() => {
    const carregarLivrosRecentes = async () => {
      const response = await fetch(`api/livro/recently`)
      const data =  await response.json();
      if(Array.isArray(data)) {
        setLivrosRecentes(data);
      }
    }
    carregarLivrosRecentes()
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/livro/search?valor=${encodeURIComponent(busca)}&filtro=${filtro}`
        );

        const data = await response.json();
        if(Array.isArray(data)) {
          setLivros(data);
        }
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busca, filtro]);

  return (
    <div className="max-w-7xl mx-auto py-2">
      <div className="bg-[#FFFDF8] border border-[#F3E5AB] rounded-3xl shadow-lg p-6 mb-8">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar livros..."
          className="w-full px-4 py-3 rounded-xl border border-[#E8D89A] bg-white outline-none focus:ring-2 focus:ring-[#F6D86B]"
        />
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => setFiltro("ano")}
            className={`px-4 py-2 rounded-xl transition ${
              filtro === "ano"
                ? "bg-[#F7D774] text-[#4F442E]"
                : "bg-white border border-[#E8D89A]"
            }`}
          >
            Ano
          </button>

          <button
            onClick={() => setFiltro("titulo")}
            className={`px-4 py-2 rounded-xl transition ${
              filtro === "titulo"
                ? "bg-[#F7D774] text-[#4F442E]"
                : "bg-white border border-[#E8D89A]"
            }`}
          >
            Título
          </button>

          <button
            onClick={() => setFiltro("autor")}
            className={`px-4 py-2 rounded-xl transition ${
              filtro === "autor"
                ? "bg-[#F7D774] text-[#4F442E]"
                : "bg-white border border-[#E8D89A]"
            }`}
          >
            Autor
          </button>

          <button
            onClick={() => setFiltro("genero")}
            className={`px-4 py-2 rounded-xl transition ${
              filtro === "genero"
                ? "bg-[#F7D774] text-[#4F442E]"
                : "bg-white border border-[#E8D89A]"
            }`}
          >
            Gênero
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {(livros.length === 0) ? exibirLivros(livrosRecentes) : exibirLivros(livros)}
      </div>
    </div>
  );
}

function exibirLivros(livros: LivroCatalogo[]) {
  return <>
    {livros.map((livro) => (
      <Link href={`livro/${livro.id}`} key={livro.id}>
        <div
          className="bg-[#FFFDF8] border border-[#F3E5AB] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
          <div className="relative h-64">
            <img
              src={livro.capa}
              alt={livro.titulo}
              className="h-65 w-100 object-fill"
              />
          </div>
          <div className="p-4">
            <h2 className="font-semibold text-[#4F442E] line-clamp-2">
              {livro.titulo}
            </h2>
            <p className="text-sm text-[#8A7A5B] mt-1">
              {(livro.autores) ? livro.autores.map(a => a.nome).join(", ") : ""}
            </p>
            <p className="text-sm text-[#8A7A5B]">
              {livro.ano}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </>
}