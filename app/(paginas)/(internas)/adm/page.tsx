'use client'

import Link from "next/link";


export default function AdminPage() {
  const navItemStyle = "m-5 p-5 border border-yellow-500"

  return (
    <div className="flex wrap">
      <Link href="/adm/livro/register"className={navItemStyle} >Adicionar livro</Link>
      <Link href="/adm/autor/register" className={navItemStyle}>Adicionar autor</Link>
      <Link href="/adm/colecao/register" className={navItemStyle}>Adicionar coleção</Link>
      <Link href="/adm/autor/edit" className={navItemStyle}>Editar autor</Link>
      <Link href="/adm/autor/delete" className={navItemStyle}>Apagar autor</Link>
    </div>
  );
}