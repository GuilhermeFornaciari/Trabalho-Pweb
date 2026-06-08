'use client'

import { useEffect, useState } from "react";
import { Livro } from "@/lib/prisma/generated/client";

export default function DeleteBook() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Livro[]>([]);

  async function apagarLivro(id: number, titulo: string, colecaoId: number | null) {
    const confirmar = window.confirm(
      `Deseja realmente apagar "${titulo}"?`
    );

    if (!confirmar) return;

    const res = await fetch(`/api/livro/delete?id=${id}&colecaoId=${colecaoId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Erro ao apagar livro");
      return;
    }

    alert("Livro apagado com sucesso");

    setResultados(prev =>
      prev.filter(livro => livro.id !== id)
    );
  }

  useEffect(() => {
    if (!busca.trim()) {
      setResultados([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(
        `/api/livro/search?titulo=${encodeURIComponent(busca)}&filtro=titulo`
      );

      const data = await res.json();

    if (Array.isArray(data)) {
      setResultados(data);
    } else {
      setResultados([]);
    }
      setResultados(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [busca]);

  return (
    <div className="min-h-screen bg-olive-50">
      <div className="flex flex-col items-center p-10">
        <div className="w-md border border-yellow-300 bg-amber-50 p-4 rounded-2xl">

          <label className="flex flex-col gap-2">
            <span>Pesquisar livro</span>

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite o título"
              className="border border-yellow-300 p-2 rounded"
            />
          </label>

          <div className="mt-4 flex flex-col gap-2">
            {resultados.map((livro) => (
              <div
                key={livro.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <div>{livro.titulo}</div>
                  <div className="text-sm text-gray-600">
                    ID: {livro.id}
                  </div>
                </div>

                <button
                  onClick={() =>
                    apagarLivro(livro.id, livro.titulo, livro.colecaoId)
                  }
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                >
                  Apagar
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}