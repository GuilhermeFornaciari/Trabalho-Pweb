'use client'

import { useEffect, useState } from "react";
import { Autor } from "@/lib/prisma/generated/client";


export default function EditAuthor() {
  const [busca, setBusca] = useState("");
  const [resultadosAutores, setResultadosAutores] = useState<Autor[]>([]);

  const [autorSelecionado, setAutorSelecionado] = useState<number>(-1);

  const [autor, setAutor] = useState("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
        try {
            const response = await fetch(
              `/api/autor/read?nome=${encodeURIComponent(busca)}`
            );

            const data = await response.json();
            if(Array.isArray(data)) {
              setResultadosAutores(data);
            }
        } catch (error) {
            console.error(error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [busca]);


  async function selecionarAutor(id: number) {
    try {
      const response = await fetch(`/api/autor/${id}`);
      const autor = await response.json();

      setAutorSelecionado(id);
      setAutor(autor.nome);
    } catch (error) {
      console.error(error);
    }
  }

  async function deletarAutor() {
    if (autorSelecionado < 0) return;

    const body = {
        id: autorSelecionado,
        nome: autor,
    };

    try {
      const response = await fetch("/api/autor/delete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Autor "${data.nome}" atualizado com sucesso.`);
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro interno ao atualizar o livro.");
    }
  }

  const labelStyle = "block py-2 flex flex-col text-lg";
  const inputStyle = "px-2 border border-yellow-300 py-px outline-0 bg-white rounded-sm";


return (
  <div className="grid grid-cols-2 gap-6">

    {/* ESQUERDA */}
    <div className="border border-yellow-300 rounded-2xl p-4 bg-amber-50">

      <h2 className="text-2xl font-semibold mb-4">
        Selecionar Autor
      </h2>

      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Pesquisar autor..."
        className="w-full p-2 border border-yellow-300 rounded"
      />

      <div className="mt-4 flex flex-col gap-2 max-h-[700px] overflow-y-auto">

        {resultadosAutores.map((autor) => (
          <button
            key={autor.id}
            type="button"
            onClick={() => selecionarAutor(autor.id)}
            className="
              text-left
              p-3
              rounded
              border
              border-yellow-300
              bg-white
              hover:bg-yellow-100
            "
          >
            <div className="font-semibold">
              {autor.nome}
            </div>
          </button>
        ))}

      </div>
    </div>

    {/* DIREITA */}
    <div className="border border-yellow-300 rounded-2xl p-4 bg-amber-50">

      {autorSelecionado < 0 ? (
        <div className="text-gray-500">
          Selecione um autor para editar.
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">
            Editar Autor
          </h2>

          <label className={labelStyle}>
            Nome
            <input
              name="nome"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className={inputStyle}
            />
          </label>

          <button
            type="button"
            onClick={deletarAutor}
            className="
              px-4
              py-2
              bg-yellow-500
              rounded-lg
              font-semibold
              hover:bg-yellow-400
            "
          >
            Salvar Alterações
          </button>
        </>
      )}

    </div>

  </div>
);
}