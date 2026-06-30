'use client'

import Link from "next/link";


export default function AdminPage() {
  const navItemStyle = "w-full px-3 py-3 border bg-white hover:bg-black hover:text-yellow-200 border-yellow-500 rounded-md m-2"

  return (
    <div className=" w-3xl m-auto bg-white rounded-lg p-5 mt-20 rounded-md shadow-md">
      <h1 className="font-bold text-2xl mb-10">Gerenciar conteúdo</h1>
      <div className="flex flex-col items-center justify-center">
        <Link href="/adm/livro/register"className={navItemStyle} >Adicionar livro</Link>
        <Link href="/adm/autor/register" className={navItemStyle}>Adicionar autor</Link>
        <Link href="/adm/colecao/register" className={navItemStyle}>Adicionar coleção</Link>
        <Link href="/adm/autor/edit" className={navItemStyle}>Editar autor</Link>
        <Link href="/adm/autor/delete" className={navItemStyle}>Apagar autor</Link>
      </div>
    </div>
  );
}