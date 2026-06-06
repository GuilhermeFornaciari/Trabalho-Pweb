'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Autor, Livro } from "@/lib/prisma/generated/client";

type LivroCatalogo = Livro & {
  autores: string;
};

export default function EditBook() {
  const [busca, setBusca] = useState("");
  const [livros, setLivros] = useState<LivroCatalogo[]>([]);
  const [resultadosAutores, setResultadosAutores] = useState<Autor[]>([]);
  const [buscaAutor, setBuscaAutor] = useState("");

  const [livroSelecionado, setLivroSelecionado] = useState<number | null>(null);
  const livroSelecionadoRef = useRef<number | null>(null);

  const [form, setForm] = useState({
    titulo: "",
    ano: "",
    genero: "",
    paginas: "",
    capa: "",
  });

  const [autores, setAutores] = useState<Autor[]>([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
        try {
            const response = await fetch(
              `/api/livro/read?valor=${encodeURIComponent(busca)}&filtro=${"titulo"}`
            );

            const data = await response.json();
            if(Array.isArray(data)) {
              setLivros(data);
            }
        } catch (error) {
            console.error(error);
      }
    }, 300);

    

    return () => clearTimeout(timeout);
  }, [busca]);

  useEffect(() => {
    if (!buscaAutor.trim()) {
      setResultadosAutores([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const res = await fetch(
        `/api/autor/read?nome=${encodeURIComponent(buscaAutor)}`
      );

      const data = await res.json();
      setResultadosAutores(data);
    }, 300);

    return () => clearTimeout(timeout);
  }, [buscaAutor]);

  async function selecionarLivro(id: number) {
    try {
      const response = await fetch(`/api/livro/id?id=${id}`);
      const livro = await response.json();

      setLivroSelecionado(id);
      livroSelecionadoRef.current = id;

      setForm({
        titulo: livro.titulo,
        ano: String(livro.ano),
        genero: livro.genero,
        paginas: String(livro.paginas),
        capa: livro.capa,
      });

      setAutores(livro.autores);
    } catch (error) {
      console.error(error);
    }
  }

  async function editarLivro() {
    const id = livroSelecionadoRef.current;
    if (!id) return;

    const body = {
      id,
      titulo: form.titulo,
      ano: Number(form.ano),
      genero: form.genero,
      paginas: Number(form.paginas),
      capa: form.capa,
      autores: autores.map((autor) => autor.id),
    };

    console.log("livroSelecionado", livroSelecionado);
    console.log(body);

    const response = await fetch("/api/livro/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    alert(`Livro ${data.titulo} atualizado com sucesso.`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function adicionarAutor(autor: Autor) {
    const existe = autores.some((a) => a.id === autor.id);

    if (existe) return;

    setAutores((prev) => [...prev, autor]);
  }

  function removerAutor(id: number) {
    setAutores((prev) => prev.filter((a) => a.id !== id));
  }

  const labelStyle = "block py-2 flex flex-col text-lg";
  const inputStyle = "px-2 border border-yellow-300 py-px outline-0 bg-white rounded-sm";


  return (
    <div className="grid grid-cols-2 gap-6">

      {/* ESQUERDA */}
      <div className="border border-yellow-300 rounded-2xl p-4 bg-amber-50">

        <h2 className="text-2xl font-semibold mb-4">
          Selecionar Livro
        </h2>

        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar livro..."
          className="w-full p-2 border border-yellow-300 rounded"
        />

        <div className="mt-4 flex flex-col gap-2 max-h-[700px] overflow-y-auto">

          {livros.map((livro) => (
            <button
              key={livro.id}
              type="button"
              onClick={() => selecionarLivro(livro.id)}
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
                {livro.titulo}
              </div>

              <div className="text-sm">
                {livro.autores}
              </div>

              <div className="text-sm text-gray-500">
                {livro.ano}
              </div>
            </button>
          ))}

        </div>
      </div>

      {/* DIREITA */}
      <div className="border border-yellow-300 rounded-2xl p-4 bg-amber-50">

        {!livroSelecionado ? (
          <div className="text-gray-500">
            Selecione um livro para editar.
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Editar Livro
            </h2>

            <label className={labelStyle}>
              Título
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className={inputStyle}
              />
            </label>

            <label className={labelStyle}>
              Ano
              <input
                name="ano"
                value={form.ano}
                onChange={handleChange}
                className={inputStyle}
              />
            </label>

            <label className={labelStyle}>
              Gênero
              <input
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className={inputStyle}
              />
            </label>

            <label className={labelStyle}>
              Páginas
              <input
                name="paginas"
                value={form.paginas}
                onChange={handleChange}
                className={inputStyle}
              />
            </label>

            <label className={labelStyle}>
              Capa
              <input
                name="capa"
                value={form.capa}
                onChange={handleChange}
                className={inputStyle}
              />
            </label>

            <label className={labelStyle}>
              Autor
              <input
                type="text"
                value={buscaAutor}
                onChange={(e) =>
                  setBuscaAutor(e.target.value)
                }
                placeholder="Pesquisar autores"
                className={inputStyle}
              />
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {autores.map((autor) => (
                <span
                  key={autor.id}
                  className="bg-yellow-200 px-2 py-1 rounded"
                >
                  {autor.nome}

                  <button
                    type="button"
                    onClick={() => removerAutor(autor.id)}
                    className="ml-2"
                  >
                    <Image
                      src="/remover.png"
                      width={15}
                      height={15}
                      alt="remover"
                      unoptimized
                    />
                  </button>
                </span>
              ))}
            </div>

            <div className="border border-yellow-300 rounded p-2 mb-4">
              {resultadosAutores.map((autor) => (
                <button
                  key={autor.id}
                  type="button"
                  onClick={() => adicionarAutor(autor)}
                  className="
                    w-full
                    text-left
                    p-2
                    rounded
                    mb-1
                    bg-yellow-300
                    hover:bg-yellow-400
                  "
                >
                  {autor.nome}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={editarLivro}
              className="
                px-4
                py-2
                bg-yellow-500
                rounded-lg
                font-semibold
                hover:bg-yellow-400
              "
            >
              Salvar Alterações
            </button>
          </>
        )}
      </div>

    </div>
  );
}