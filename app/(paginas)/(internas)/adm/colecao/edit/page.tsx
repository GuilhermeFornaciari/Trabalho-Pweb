'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Colecao, Livro } from "@/lib/prisma/generated/client";

export default function EditColection() {
  
  const [busca, setBusca] = useState("");
  const [ColecaoSelecionado, setColecaoSelecionado] = useState<number>(-1);
  const [colecaoLista, setColecaoLista] = useState<Colecao[]>([])

  // =========================================

  const [livros, setLivros] = useState<Livro[]>([])

  const [colecao, setColecao] = useState("");
    
  const [buscaLivros, setBuscaLivros] = useState("");
  const [resultadosLivros, setResultadosLivros] = useState<Livro[]>([]);
  
  async function cadastrar() {
    if(colecao === ""){
      alert(`Nome da colecao não foi preenchido!`);
        return;
    }

  const body = {
      nome: colecao,
      livros: livros.map((livro, index) => ({id: livro.id, posicao: index})) // gambirra temporaria
    };

    const res = await fetch("/api/colecao/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(`O colecao ${data.nome} foi criado com sucesso. Id: ${data.id}`)
    console.log(data);
  }

  function adicionarLivro(livro: Livro) {
    const jaExiste = livros.some(a => a.id === livro.id);
    if(jaExiste) return;
    setLivros(prev => [...prev, livro]);
  }

  function removerLivro(id: number) {
    setLivros(prev =>
      prev.filter(a => a.id !== id)
    );
  }


  // =========================================================
  useEffect(() => {
    if (!buscaLivros.trim()) {
      setResultadosLivros([]);
      return;
    }

    const timeout = setTimeout(async () => {
       const response = await fetch(
          `/api/livro/search?valor=${encodeURIComponent(buscaLivros)}&filtro=${"titulo"}`
        );

        const data = await response.json();
        if(Array.isArray(data)) {
        //   setLivros(data);
        setResultadosLivros(data);
        }

    }, 300);

    return () => clearTimeout(timeout);
  }, [buscaLivros]);


    useEffect(() => {
      async function carregarColecoes() {
        const response = await fetch(`/api/colecao/read?nome=${busca}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setColecaoLista(data);
        }
      }

      carregarColecoes();
    }, [busca]);

async function selecionarColecao(id: number) {
  
  try {
    const response = await fetch(`/api/colecao/${id}`);
    console.log(JSON.stringify(response, null, 2));
    const colecao = await response.json();

    console.log("livros carregados", JSON.stringify(colecao.livros));
    console.log("colecaoLista", colecaoLista);
    console.log("livros", livros);
    console.log("resultadosLivros", resultadosLivros);

    setColecaoSelecionado(id);
    setColecao(colecao.nome);

    setLivros(colecao.livros);
    setResultadosLivros(colecao.livros);

  } catch (error) {
    console.error(error);
  }
}


  const labelStyle = "block py-2 flex flex-col text-lg";
  const spanStyle = "mr-2 color-black";
  const inputStyle = "px-2 border border-yellow-300 py-px outline-0 bg-white rounded-sm";

 return (
  <div className="grid grid-cols-2 gap-6">

    {/* ESQUERDA */}
    <div className="border border-yellow-300 rounded-2xl p-4 bg-amber-50">
      <h2 className="text-2xl font-semibold mb-4">
        Selecionar Coleção
      </h2>

      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Pesquisar coleção..."
        className="w-full p-2 border border-yellow-300 rounded"
      />

      <div className="mt-4 flex flex-col gap-2 max-h-[700px] overflow-y-auto">
        {colecaoLista.map((colecao) => (
          <button
            key={colecao.id}
            type="button"
            onClick={() => selecionarColecao(colecao.id)}
            className="
              text-left
              p-3
              rounded
              border
              border-yellow-300
              bg-white
              hover:bg-yellow-100
            "
          >
            <div className="font-semibold">
              {colecao.nome}
            </div>

            <div className="text-sm text-gray-500">
              ID: {colecao.id}
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* DIREITA */}
    <div className="border border-yellow-300 rounded-2xl p-4 bg-amber-50">

      {ColecaoSelecionado < 0 ? (
        <div className="text-gray-500">
          Selecione uma coleção para editar.
        </div>
      ) : (
        <>
          <label className={labelStyle}>
            <span className={spanStyle}>Título</span>
            <input
              type="text"
              className={inputStyle}
              value={colecao}
              onChange={(e) => setColecao(e.target.value)}
            />
          </label>

          <label className={labelStyle}>
            <span className={spanStyle}>Livros</span>
            <input
              type="text"
              placeholder="Pesquisar livros"
              className={inputStyle}
              value={buscaLivros}
              onChange={(e) => setBuscaLivros(e.target.value)}
            />
          </label>

          <div className="flex flex-wrap gap-2 p-1">
            {livros.map((livro) => (
              <span
                key={livro.id}
                className="px-2 py-1 rounded bg-yellow-200"
              >
                {livro.titulo}

                <button
                  type="button"
                  onClick={() => removerLivro(livro.id)}
                  className="ml-2"
                >
                  <Image
                    unoptimized
                    src="/remover.png"
                    width={20}
                    height={20}
                    alt="Remover"
                  />
                </button>
              </span>
            ))}
          </div>

          <div className="border border-yellow-300 p-1 rounded-sm mt-2">
            {resultadosLivros.map((livro) => (
              <button
                key={livro.id}
                type="button"
                onClick={() => adicionarLivro(livro)}
                className="
                  w-full
                  text-left
                  p-2
                  border-2
                  border-amber-400
                  bg-amber-400
                  hover:bg-yellow-400
                  hover:border-black
                  rounded-md
                "
              >
                {livro.titulo}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="p-3 font-semibold bg-yellow-500 rounded-lg"
              onClick={cadastrar}
            >
              Confirmar
            </button>

            <Link
              href="/"
              className="p-3 font-semibold bg-red-600 rounded-lg text-white"
            >
              Cancelar
            </Link>
          </div>
        </>
      )}

    </div>
  </div>
);
}