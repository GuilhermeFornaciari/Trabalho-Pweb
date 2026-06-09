'use client'

import { useState } from "react";
import Link from "next/link";


export default function AdminPage() {
  const navItemStyle = "p-5 border border-yellow-500"

  return (
    <div>
      <Link href="/adm/livro/register"className={navItemStyle} >Adicionar livro</Link>
      <Link href="/adm/autor/register" className={navItemStyle}>Adicionar autor</Link>
      <Link href="/adm/colecao/register" className={navItemStyle}>Adicionar coleção</Link>
    </div>
  );
}