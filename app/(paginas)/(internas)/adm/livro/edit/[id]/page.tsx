'use client'

import { use, useEffect, useState } from "react";
import { Livro } from "@/lib/prisma/generated/client";
import LivroForm from "@/components/livro/livroForm";
import { Autor } from "@/lib/prisma/generated/client";
import { useRouter } from "next/navigation";

type LivroDetalhes = Livro & {
  autores: Array<{id: number, nome: string}> 
}

type LivroFormData = {
  titulo: string;
  ano: string;
  genero: string;
  paginas: string;
  sinopse: string;
  capa: string;
};

export default function EditarLivro({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = use(params);
  const [livro, setLivro] = useState<LivroDetalhes | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    ano: "",
    genero: "",
    paginas: "",
    sinopse: "",
    capa: ""
  })
  const [autores, setAutores] = useState([]);
  const route = useRouter();
  
  useEffect(() => {
    const carregarLivro = async () => {
      const response = await fetch(`/api/livro/${id}`);
      if(response.ok) {
        const data = await response.json();
        setLivro(data);
        setForm({
          titulo: data.titulo,
          ano: data.ano.toString(),
          genero: data.genero,
          paginas: data.paginas.toString(),
          sinopse: data.sinopse,
          capa: data.capa
        })
        setAutores(data.autores);
      }
    }
    carregarLivro();
  }, []);

  async function editarLivro(form: LivroFormData, autores: Autor[] ) {
    const body = {
      id: id,
      titulo: form.titulo,
      ano: Number(form.ano),
      genero: form.genero,
      paginas: Number(form.paginas),
      capa: form.capa,
      sinopse: form.sinopse,
      autores: autores.map((autor) => autor.id),
    };

    try {
      const response = await fetch("/api/livro/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Livro "${data.titulo}" atualizado com sucesso.`);
      } else {
        alert(`Erro: ${data.message}`);
      }
      route.push("/adm")
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro interno ao atualizar o livro.");
    }
  }

  return (  
    (livro) ? <LivroForm descricao="Editar livro" livro={form} autoresIniciais={autores} onSubmit={editarLivro}/> : ''
  )
}