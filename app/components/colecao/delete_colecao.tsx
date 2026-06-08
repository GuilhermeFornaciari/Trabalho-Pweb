'use client'

import { useEffect, useState } from "react";
import { Colecao } from "@/lib/prisma/generated/client";

export default function DeleteColecao() {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState<Colecao[]>([]);

  async function apagarColecao(id: number, nome: string) {
    const confirmar = window.confirm(
      `Deseja realmente apagar "${nome}"?`
    );

    if (!confirmar) return;

    const res = await fetch(`/api/colecao/delete?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Erro ao apagar coleção");
      return;
    }

    alert("Coleção apagada com sucesso");

    setResultados(prev =>
      prev.filter(colecao => colecao.id !== id)
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
          `/api/colecao/read?nome=${encodeURIComponent(busca)}`
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
            <span>Pesquisar coleção</span>

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Digite o nome"
              className="border border-yellow-300 p-2 rounded"
            />
          </label>

          <div className="mt-4 flex flex-col gap-2">
            {resultados.map((colecao) => (
              <div
                key={colecao.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <div>{colecao.nome}</div>
                  <div className="text-sm text-gray-600">
                    ID: {colecao.id}
                  </div>
                </div>

                <button
                  onClick={() =>
                    apagarColecao(
                      colecao.id,
                      colecao.nome
                    )
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