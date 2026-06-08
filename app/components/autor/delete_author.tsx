'use client'

import { useEffect, useState } from "react";
import { Autor } from "@/lib/prisma/generated/client";

export default function DeleteAuthor() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Autor[]>([]);

  async function apagarAutor(id: number, nome: string) {
    const confirmar = window.confirm(
      `Deseja realmente apagar "${nome}"?`
    );

    if (!confirmar) return;

    const res = await fetch(`/api/autor/delete?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Erro ao apagar autor");
      return;
    }

    alert("Autor apagado com sucesso");

    setResultados(prev =>
      prev.filter(autor => autor.id !== id)
    );
  }

  useEffect(() => {
    if (!busca.trim()) {
      setResultados([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/autor/read?nome=${encodeURIComponent(busca)}`
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setResultados(data);
        } else {
          setResultados([]);
        }
      } catch (error) {
        console.error(error);
        setResultados([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busca]);

  return (
    <div className="min-h-screen bg-olive-50">
      <div className="flex flex-col items-center p-10">
        <div className="w-md border border-yellow-300 bg-amber-50 p-4 rounded-2xl">

          <label className="flex flex-col gap-2">
            <span>Pesquisar autor</span>

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite o nome"
              className="border border-yellow-300 p-2 rounded"
            />
          </label>

          <div className="mt-4 flex flex-col gap-2">
            {resultados.map((autor) => (
              <div
                key={autor.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <div>{autor.nome}</div>
                  <div className="text-sm text-gray-600">
                    ID: {autor.id}
                  </div>
                </div>

                <button
                  onClick={() =>
                    apagarAutor(autor.id, autor.nome)
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