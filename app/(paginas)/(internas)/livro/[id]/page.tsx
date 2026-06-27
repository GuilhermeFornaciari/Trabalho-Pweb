'use client'

import { use, useEffect, useState } from "react";
import { Biblioteca, Colecao, Livro, Postagem } from "@/lib/prisma/generated/client";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import ResenhaCard from "@/components/resenha/resenhaCard";
import ResenhaModal from "@/components/resenha/resenhaModal";
import BibliotecaButton from "@/components/biblioteca/bibliotecaButton";
import { LivroDetalhes } from "@/lib/types/livroDetalhes";

type ResenhaDetalhes = Postagem & {
  usuario: {
    id: number;
    nome: string;
    username: string;
    foto: string | null;
  };
  curtidas: any[];
};

export default function DetalhesLivro({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = use(params);
  const [livro, setLivro] = useState<LivroDetalhes | null>(null);

  const [mostrarModal, setMostrarModal] = useState(false);  
  const { data: session } = useSession();
  const adm = session?.user?.role === "ADM";
  
  const [mostrarModalResenha, setMostrarModalResenha] = useState<ResenhaDetalhes | null>(null);
  const [comentario, setComentario] = useState("");
  
  const [mostrarModalResenhaCreate, setMostrarModalResenhaCreate] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [resenha, setResenha] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [nota, setNota] = useState(0);

  
  const [resenhas, setResenhas] = useState<ResenhaDetalhes[]>([]);

  useEffect(() => {
    async function carregarResenhas() {
      const response = await fetch(`/api/resenha/get?livroId=${id}`);

      if (response.ok) {
        const data = await response.json();
        setResenhas(data);
      }
    }

    carregarResenhas();
  }, [id]);

  async function curtidas(){
    
  }


  async function submitComentario(idResenha: number){
    if(!session?.user.id){
      alert("Você precisa estar logado.");
      return;
    }

    if (!livro?.id) {
      alert("Livro sem ID.");
      return;
    }

    const response = await fetch("../api/comentario/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postagemId: idResenha,
        usuarioId: session.user.id,
        texto: comentario,

      }),
    });

    if (!response.ok) {
      const erro = await response.json();
      console.log(erro);
      alert(JSON.stringify(erro, null, 2));
      return;
    }
    
    
    setMostrarModalResenha(null);
    setComentario("");
    alert("Comentario criado com sucesso!");
  }

  async function submitResenha() {
    if (!session?.user?.id) {
      alert("Você precisa estar logado.");
      return;
    }

    if (!livro?.id) {
      alert("Livro sem ID.");
      return;
    }

    const response = await fetch("../api/resenha/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        livroId: livro.id,
        usuarioId: session.user.id,
        titulo,
        texto: resenha,
        nota,
        spoiler,
      }),
    });

    if (!response.ok) {
      const erro = await response.json();
      console.log(erro);
      alert(JSON.stringify(erro, null, 2));
      return;
    }

    setMostrarModalResenhaCreate(false);
    setResenha("");
    setNota(0);
    setSpoiler(false);

    alert("Resenha criada com sucesso!");
  }



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
  }

  return(
      (livro) ? 
        <>
          {/* topo do livro */}
          {livro &&
            informacoesDoLivro(
              livro,
              id,
              setMostrarModal,
              adm
            )
          }
          
          {/* botão de escreever resenha */}
          <div className="w-4xl m-auto flex justify-end mb-4">
            <button
              className="px-5 py-3 rounded-md bg-blue-600 text-white"
              onClick={() => setMostrarModalResenhaCreate(true)}
            >
              Escrever Resenha
            </button>
          </div>
          
          {/* listagem de resenhas */}
         {resenhas.map((resenha) => (
            <ResenhaCard
              key={resenha.id}
              resenha={resenha}
              onClick={setMostrarModalResenha}
            />
          ))}



          {/* criar resenha (usuario) */}
          {mostrarModalResenhaCreate && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">
                  Nova Resenha
                </h2>

                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitResenha();
                  }}
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <Star
                        key={valor}
                        size={32}
                        onClick={() => setNota(valor)}
                        className={`cursor-pointer ${
                          valor <= nota
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Título
                    </label>

                    <input
                    type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      Resenha
                    </label>

                    <textarea
                      value={resenha}
                      onChange={(e) => setResenha(e.target.value)}
                      rows={8}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={spoiler}
                      onChange={(e) => setSpoiler(e.target.checked)}
                    />

                    Contém spoiler
                  </label>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-300 rounded-md"
                      onClick={() => setMostrarModalResenhaCreate(false)}
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                      Salvar Resenha
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          

          {/* modal de exclusão do livro (adm) */}
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

          {/* modal de ver a resenha pronta pra poder comentar e curitr */}
           {mostrarModalResenha && (
            <ResenhaModal
              resenha={mostrarModalResenha}
              comentario={comentario}
              onChangeComentario={setComentario}
              onSubmitComentario={submitComentario}
              onClose={() => setMostrarModalResenha(null)}
            />
)}

        </>       
      : ''
  );
}





function informacoesDoLivro(
  livro: LivroDetalhes,
  id: string,
  setMostrarModal: (value: boolean) => void,
  adm: boolean
) {
  const spanStyle = "font-semibold";
  const buttonStyle = "px-5 py-3 rounded-md";
  
  return (
    <div className="w-4xl my-5 p-5 m-auto flex border border-amber-300 rounded-md">
      <div className="me-5 flex flex-col">
        <img src={livro.capa} alt="Capa" className="w-50 h-75 rounded-sm" />
         {!adm && (
          <div className="py-3 flex flex-col justify-center items-center">
            <BibliotecaButton livro={livro} buttonStyle={buttonStyle}></BibliotecaButton>

          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h1 className="font-bold text-xl">{livro.titulo}</h1>
          <p>{livro.autores.map(a => a.nome).join(", ")}</p>

          {livro.colecao && (
            <Link href={`/colecao/${livro.colecao.id}`}>
              {livro.colecao.nome} #{livro.posicao_colecao}
            </Link>
          )}
        </div>

        <div className="my-5">
          <h2 className="font-semibold">Sinopse:</h2>
          <p>{livro.sinopse}</p>
        </div>

        <div>
          <p><span className={spanStyle}>Gênero:</span> {livro.genero}</p>
          <p><span className={spanStyle}>Páginas:</span> {livro.paginas}</p>
          <p><span className={spanStyle}>Ano:</span> {livro.ano}</p>
        </div>

  
        <div className="flex justify-end gap-4 mt-6">
          {adm && (
            <>
              <Link
                href={`/adm/livro/edit/${id}`}
                className={`${buttonStyle} bg-yellow-400`}
              >
                Editar
              </Link>

              <button
                className={`${buttonStyle} bg-red-500 text-white`}
                onClick={() => setMostrarModal(true)}
              >
                Apagar
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}