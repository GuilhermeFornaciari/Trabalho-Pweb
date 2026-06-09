'use client'

import { use, useEffect, useState } from "react";
import { Livro } from "@/lib/prisma/generated/client";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { Router } from "next/router";

type LivroDetalhes = Livro & {
  autores: Array<{id: number, nome: string}> 
}

export default function DetalhesLivro({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = use(params);
  const [livro, setLivro] = useState<LivroDetalhes | null>(null);
  const buttonStyle = "px-5 py-3 rounded-md"

  const [mostrarModal, setMostrarModal] = useState(false);

  const route = useRouter();

  useEffect(() => {
    const carregarLivro = async () => {
      const response = await fetch(`/api/livro/${id}`);
      if(response.ok) {
        const data = await response.json();
        setLivro(data);
      }
    }
    carregarLivro();
  }, [])
  
  async function apagarLivro(id: number, colecaoId: number | null) {

    const res = await fetch(`/api/livro/delete?id=${id}&colecaoId=${colecaoId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Erro ao apagar livro");
      return;
    }
    
    route.push("/catalogo");
    // alert("Livro apagado com sucesso");
  }

  return(
      (livro) ? 
        <>
          {informacoesDoLivro(livro)}
          <div className="w-2xl m-auto flex justify-around">
            <Link href={`/adm/livro/edit/${id}`} className={buttonStyle + " bg-yellow-400"}>Editar</Link>
            <button className={buttonStyle + " bg-red-500"} type="button" onClick={() => setMostrarModal(true)} >Apagar</button>
          </div>


          {mostrarModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-lg min-w-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Confirmar exclusão
                </h2>

                <p className="mb-6">
                  Tem certeza que deseja apagar este livro?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-md"
                    onClick={() => setMostrarModal(false)}
                  >
                    Não
                  </button>

                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => { apagarLivro(livro.id, livro.colecaoId) }}
                  >
                    Sim
                  </button>
                </div>
              </div>
            </div>
          )}
        </>       
      : ''
  );
}

function informacoesDoLivro(livro: LivroDetalhes) {
  const spanStyle = "font-semibold";
  return(
    <div className="w-4xl my-5 p-5 m-auto flex border border-amber-300 rounded-md">
      <div className="me-5">
        <img src={livro.capa} alt="Capa" className="w-50 h-75 rounded-sm" />
      </div>
      <div className="w-1/2 flex flex-col flex-1 justify-between">
        <div>
          <h1 className="font-bold text-xl">{livro.titulo}</h1>
          <p>
            {livro.autores.map(a => a.nome)
                        .join(",")
                      }
          </p>
        </div>
        <div className="my-5">
          <h2 className="font-semibold">Sinopse:</h2>
          <p className="text-ellipsis overflow-hidden">{livro.sinopse}</p>
        </div>
        <div>
          <p><span className={spanStyle}>Gênero:</span> {livro.genero}</p>
          <p><span className={spanStyle}>Páginas:</span> {livro.paginas}</p>
          <p><span className={spanStyle}>Ano de lançamento da edição:</span> {livro.ano}</p>
        </div>
      </div>
    </div>
  );
}