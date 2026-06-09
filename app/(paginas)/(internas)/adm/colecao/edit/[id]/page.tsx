'use client'

import { Colecao, Livro } from "@/lib/prisma/generated/client";
import ColecaoForm from "@/components/colecao/colecaoForm";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

type ColecaoDetails = Colecao & {
  livros: Livro[]
}

export default function EditColection({
    params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = use(params);
  const route = useRouter();

  const [colecao, setColecao] = useState<ColecaoDetails | null>(null);
  useEffect(() => {
    const carregarColecao = async () => {
      const response = await fetch(`/api/colecao/${id}`);
      if(response.ok) {
        const data = await response.json();
        setColecao(data);
      }
    }
    carregarColecao();
  }, []);

  async function editar(nome: string, livros: Livro[]) {
    const body = {
      id: id,
      nome: nome,
      livros: livros.map((livro) => ({id: livro.id, posicao: livro.posicao_colecao})) 
    };

    const res = await fetch("/api/colecao/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log(data);
    alert(`A colecao ${data.nome} foi editada com sucesso. Id: ${data.id}`)
    route.push("/adm")
  }

  return (
    (colecao) ? <ColecaoForm nomeInicial={colecao.nome} livrosIniciais={colecao.livros} descricao="Cadastrar coleção" onSubmit={editar}></ColecaoForm> : ''
  );
}