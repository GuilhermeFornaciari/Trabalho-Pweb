'use client'

import { use, useEffect, useState } from "react";
import { Colecao, Livro } from "@/lib/prisma/generated/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ColecaoDetails = Colecao & {
  livros: Livro[]
}

export default function DetalhesColecao({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const {id} = use(params);
    const [colecao, setColecao] = useState<ColecaoDetails | null>(null);
    const buttonStyle = "px-5 py-3 rounded-md";
    const route = useRouter();
  
    const [mostrarModal, setMostrarModal] = useState(false);
    
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

  async function apagarColecao() {

    const res = await fetch(`/api/colecao/delete?id=${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Erro ao apagar colecao");
      return;
    }
    
    route.push("/catalogo");
  }

    return (
      (colecao) ?
        <>
          <p className="text-center">Coleção</p>
          <h1 className="text-5xl">{colecao.nome}</h1>
          {colecao.livros.map(livro => {
            return (
              <div key={livro.id} className="w-sm mx-auto my-3 p-5 border border-yellow-300 rounded-md flex flex-col justify-center items-center">
                <div className="mb-3">
                  <Link href={`/livro/${livro.id}`} className="text-lg"><h2>{livro.titulo} - #{livro.posicao_colecao}</h2></Link>
                  <p></p>
                </div>
                <img src={livro.capa} alt={livro.titulo} className="w-30 h-50 rounded-sm" />
              </div>
              );
          })}
          <div className="w-2xl m-auto flex justify-around">
            <Link href={`/adm/colecao/edit/${id}`} className={buttonStyle + " bg-yellow-400"}>Editar</Link>
            <button className={buttonStyle + " bg-red-500"} type="button" onClick={() => setMostrarModal(true)} >Apagar</button>
          </div>
          {mostrarModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-lg min-w-sm">
                <h2 className="text-lg font-semibold mb-4">
                  Confirmar exclusão
                </h2>

                <p className="mb-6">
                  Tem certeza que deseja apagar esta coleção?
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
                    onClick={() => { apagarColecao() }}
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