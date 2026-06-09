'use client'

import { useState, useEffect } from "react";
import { Autor } from "@/lib/prisma/generated/client";
import LivroForm from "@/components/livro/livroForm";

type LivroFormData = {
  titulo: string;
  ano: string;
  genero: string;
  paginas: string;
  sinopse: string;
  capa: string;
};

export default function RegisterBook() {
  const [form, setForm] = useState({
    titulo: "",
    ano: "",
    genero: "",
    paginas: "",
    sinopse: "",
    capa: ""
  })
  
  async function cadastrar(form: LivroFormData, autores: Autor[]) {
    const body = {
      titulo: form.titulo,
      ano: Number(form.ano),
      genero: form.genero,
      paginas: Number(form.paginas),
      capa: form.capa,
      sinopse: form.sinopse,
      autores: autores.map(autor => autor.id)
    };

    const res = await fetch("/api/livro/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(`O livro ${data.titulo} foi criado com sucesso. Id: ${data.id}`)
    console.log(data);
  }

  return (
    <LivroForm livro={form} onSubmit={cadastrar}/>
  );
}