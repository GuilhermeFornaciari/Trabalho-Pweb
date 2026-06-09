import { useState, useEffect } from "react";
import { Livro } from "@/lib/prisma/generated/client";
import Link from "next/link";
import Image from "next/image";

type ColecaoFormProps = {
  descricao: string,
  nomeInicial ?: string;
  livrosIniciais ?: Livro[];
  onSubmit: (nome: string, livros: Livro[]) => Promise<void>;
};

export default function ColecaoForm({
  descricao,
  nomeInicial = "",
  livrosIniciais = [],
  onSubmit,
}: ColecaoFormProps) {
  const [colecao, setColecao] = useState(nomeInicial);
  const [livros, setLivros] = useState(livrosIniciais);
  const [buscaLivros, setBuscaLivros] = useState("");
  const [resultadosLivros, setResultadosLivros] = useState<Livro[]>([]);

  async function handleSubmit() {
    if(colecao.trim().length === 0) {
      alert("Nome da coleção não foi preenchido!");
      return;
    }

    if(livros.length === 0) {
      alert("Nenhum livro selecionado! É necessário selecionar um livro que pertença a coleção.")
    }

    await onSubmit(colecao, livros);
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
          setResultadosLivros(data);
        }

    }, 300);

    return () => clearTimeout(timeout);
  }, [buscaLivros]);

  const labelStyle = "block py-2 flex flex-col text-lg";
  const spanStyle = "mr-2 color-black";
  const inputStyle = "px-2 border border-yellow-300 py-px outline-0 bg-white rounded-sm";

  return (
      <div className="flex flex-col flex-1 items-center justify-center p-10">
        <h1 className="text-slate-700 text-3xl font-semibold mb-3">{descricao}</h1>
        <div className="w-md my-5 mx-auto border border-yellow-300 bg-amber-50 p-3 rounded-2xl">
          <form 
            id="formulario"
            name="formulario"
          >
            <label className={labelStyle}>
              <span className={spanStyle}>Título</span>
              <input type="text" name="titulo" id="titulo" className={inputStyle} value={colecao} onChange={(e) => setColecao(e.target.value)} required/>
            </label>

            <label className={labelStyle}>
              <span className={spanStyle}>Livros</span>
              <input type="text" name="autor" id="autor"placeholder="Pesquisar Livros" className={inputStyle} value={buscaLivros} onChange={(e) => setBuscaLivros(e.target.value)} required/>
            </label>
            <div className="flex flex-col justify-start items-center flex-wrap p-1">
              {livros.map((item) => (
                <span
                  key={item.id}
                  className="flex items-center gap-2 px-4 py-1 rounded bg-yellow-200 w-full"
                >
                  <span className="flex-1">
                    {item.titulo}
                  </span>

                  <input
                    type="number"
                    min={0}
                    value={item.posicao_colecao ?? ""}
                    onChange={(e) =>
                      setLivros(prev =>
                        prev.map(l =>
                          l.id === item.id
                            ? {
                                ...l,
                                posicao_colecao:
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                              }
                            : l
                        )
                      )
                    }
                    className="w-16 border border-black rounded px-1 bg-olive-50"
                  />

                  <button
                    type="button"
                    onClick={() => removerLivro(item.id)}
                  className="mx-2 ml-auto" > <Image unoptimized src="/remover.png" width={20} height={20} alt="Remover"></Image>
                  </button>
                </span>
              ))}
            </div>

            <div className="border border-yellow-300 p-1 rounded-sm">
              {resultadosLivros.map((livro) => (
                <button
                  key={livro.id}
                  type="button"
                  onClick={() => adicionarLivro(livro)}
                  className="box-border border-amber-400 text-sm bg-amber-400 border-2 hover:border-black hover:bg-yellow-400 w-full rounded-md text-start p-2 shadow-black"
                >
                  {livro.titulo}
                </button>
              ))}
            </div>

          </form>

        </div>
        <div className="w-md flex justify-between">
          <button className="p-3 font-semibold bg-yellow-500 border border-yellow-500 ease-in-out durantion-500 hover:bg-yellow-400 hover:shadow-[0_0_3px_rgb(3,3,3)] hover:border-slate-700 shadow-indigo-950 rounded-lg" 
          onClick={handleSubmit}>
            Confirmar
          </button>
          <Link href="/catalogo" className="p-3 font-semibold bg-red-600 hover:bg-rose-700 rounded-lg text-olive-50">Cancelar</Link>
        </div>
      </div>
  );
}