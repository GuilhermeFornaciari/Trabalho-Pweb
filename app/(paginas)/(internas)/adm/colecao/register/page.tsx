'use client'

import { Livro } from "@/lib/prisma/generated/client";
import ColecaoForm from "@/components/colecao/colecaoForm";

export default function RegisterColection() {
  async function cadastrar(nome: string, livros: Livro[]) {
    const body = {
      nome: nome,
      livros: livros.map((livro) => ({id: livro.id, posicao: livro.posicao_colecao})) 
    };

    const res = await fetch("/api/colecao/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(`A colecao ${data.nome} foi criado com sucesso. Id: ${data.id}`)
    console.log(data);
  }

  return (
    <ColecaoForm descricao="Cadastrar coleção" onSubmit={cadastrar}></ColecaoForm>
  );
}