'use client'

import { useState } from "react";
import Header from "@/components/header";
import RegisterBook from "@/components/livro/register_book";
import EditBook from "@/components/livro/edit_book";
import RegisterColection from "@/components/colecao/register_colecao";


export default function AdminPage() {

    
const [entidade, setEntidade] = useState<
      "livro" | "autor" | "colecao"
    >("livro");

    const [modo, setModo] = useState<
      "criar" | "editar"
    >("criar");

  return (
    <>
      <Header />

      <div className="flex cgap-2 mb-4">
          <button
            onClick={() => setEntidade("livro")}
            className={entidade === "livro"
              ? "bg-yellow-500 p-2 rounded"
              : "bg-gray-200 p-2 rounded"}
          >
            Livro
          </button>

          <button
            onClick={() => setEntidade("autor")}
            className={entidade === "autor"
              ? "bg-yellow-500 p-2 rounded"
              : "bg-gray-200 p-2 rounded"}
          >
            Autor
          </button>

          <button
            onClick={() => setEntidade("colecao")}
            className={entidade === "colecao"
              ? "bg-yellow-500 p-2 rounded"
              : "bg-gray-200 p-2 rounded"}
          >
            Coleção
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setModo("criar")}
            className={modo === "criar"
              ? "bg-green-600 text-white p-2 rounded"
              : "bg-gray-200 p-2 rounded"}
          >
            Criar
          </button>

          <button
            onClick={() => setModo("editar")}
            className={modo === "editar"
              ? "bg-blue-600 text-white p-2 rounded"
              : "bg-gray-200 p-2 rounded"}
          >
            Editar
          </button>
        </div>

      {entidade === "livro" && modo === "criar" && <RegisterBook />}
      {entidade === "livro" && modo === "editar" && <EditBook />}

      {entidade === "autor" && modo === "criar" && <CreateAuthor />}
      {entidade === "autor" && modo === "editar" && <EditAuthor />}

      {entidade === "colecao" && modo === "criar" && <RegisterColection />}
      {entidade === "colecao" && modo === "editar" && <EditCollection />}
    </>
  );
}