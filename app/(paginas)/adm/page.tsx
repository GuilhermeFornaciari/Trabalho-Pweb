'use client'

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import RegisterBook from "@/components/livro/register_book";
import EditBook from "@/components/livro/edit_book";
import RegisterColection from "@/components/colecao/register_colecao";
import EditColection from "@/components/colecao/edit_colecao";
import RegisterAuthor from "@/components/autor/register_author";
import EditAuthor from "@/components/autor/edit_author";
import DeleteBook from "@/components/livro/delete_livro";
import DeleteAuthor from "@/components/autor/delete_author";
import DeleteColecao from "@/components/colecao/delete_colecao";


export default function AdminPage() {

    
const [entidade, setEntidade] = useState<
      "livro" | "autor" | "colecao"
    >("livro");

    const [modo, setModo] = useState<
      "criar" | "editar" | "deletar"
    >("criar");

    const navItemStyle = "p-5 border border-yellow-500"

  return (
    <>
      <Header />
      <div>
        <Link href="/adm/livro/register"className={navItemStyle} >Adicionar livro</Link>
        <Link href="/adm/autor/register" className={navItemStyle}>Adicionar autor</Link>
        <Link href="/adm/colecao/register" className={navItemStyle}>Adicionar coleção</Link>
      </div>




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

          <button
            onClick={() => setModo("deletar")}
            className={modo === "deletar"
              ? "bg-blue-600 text-white p-2 rounded"
              : "bg-gray-200 p-2 rounded"}
          >
            Deletar
          </button>
        </div>

      {entidade === "livro" && modo === "criar" && <RegisterBook />}
      {entidade === "livro" && modo === "editar" && <EditBook />}
      {entidade === "livro" && modo === "deletar" && <DeleteBook />}

      {entidade === "autor" && modo === "criar" && <RegisterAuthor />}
      {entidade === "autor" && modo === "editar" && <EditAuthor />}
      {entidade === "autor" && modo === "deletar" && <DeleteAuthor />}

      {entidade === "colecao" && modo === "criar" && <RegisterColection />}
      {entidade === "colecao" && modo === "editar" && < EditColection/>}
      {entidade === "colecao" && modo === "deletar" && < DeleteColecao/>}
    </>
  );
}