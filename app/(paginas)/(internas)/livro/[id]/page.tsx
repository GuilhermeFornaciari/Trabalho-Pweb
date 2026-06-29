'use client'

import { use, useEffect, useState } from "react";
import { Biblioteca, Postagem, StatusLeitura } from "@/lib/prisma/generated/client";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import ResenhaCard from "@/components/resenha/resenhaCard";
import ResenhaModal from "@/components/resenha/resenhaModal";
import BibliotecaButton from "@/components/biblioteca/bibliotecaButton";
import { LivroDetalhes } from "@/lib/types/livroDetalhes";
import Modal from "@/components/modal";
import ProgressoForm from "@/components/progresso/progressoForm";
import Paginacao from "@/components/paginacao";
import { UsuarioPerfil } from "@/lib/types/usuarioPerfil";

type ResenhaDetalhes = Postagem & {
  usuario: {
    id: number;
    nome: string;
    username: string;
    foto: string | null;
  };
  comentarios: any [];
  curtidas: any[];
};

export default function DetalhesLivro({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params);
  const [livro, setLivro] = useState<LivroDetalhes | null>(null);

  // Estados de Controle de Modais distintos
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false);  
  const [mostrarModalResenhasLista, setMostrarModalResenhasLista] = useState(false); // Novo estado isolado

  const { data: session } = useSession();
  const adm = session?.user?.role === "admin";
  
  const [mostrarModalResenha, setMostrarModalResenha] = useState<ResenhaDetalhes | null>(null);
  
  const [mostrarModalResenhaCreate, setMostrarModalResenhaCreate] = useState(false);
  const [modalProgresso, setModalProgresso] = useState(false);
  const [progresso, setProgresso] = useState<Postagem | null>(null);
  const [titulo, setTitulo] = useState("");
  const [resenha, setResenha] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [nota, setNota] = useState(0);
  
  const [resenhas, setResenhas] = useState<ResenhaDetalhes[]>([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [idComentarioSendoEditado, setIdComentarioSendoEditado] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");

  const [apagarComentario, setApagarComentario] = useState(-1)

  async function carregarResenhas() {
    const response = await fetch(`/api/resenha/get?livroId=${id}&pagina=${pagina}`);

    if (response.ok) {
      const data = await response.json();

      setResenhas(data.resenhas || []);
      setTotalPaginas(Math.ceil((data.total || 1) / 10));

      if (mostrarModalResenha) {
        const novaResenha = data.resenhas?.find(
          (r: ResenhaDetalhes) => r.id === mostrarModalResenha.id
        );

        if (novaResenha) {
          setMostrarModalResenha(novaResenha);
        }
      }

      // console.log(mostrarModalResenha)
    }
  }
  
  async function carregarProgresso() {
    if(session === null || livro === null) return;
    const req = await fetch(
      `/api/progresso/getLast?usuarioId=${session.user.id}&livroId=${livro.id}`
    );

    if(!req.ok) return;

    const dados = await req.json();
    setProgresso(dados.dados);
  }

  useEffect(() => {
    carregarResenhas();
  }, [id, pagina]);

  useEffect(() => {
    if(!livro) return;
    if(!session?.user.id) return;
    if(livro.biblioteca?.status !== StatusLeitura.LENDO) return;

    carregarProgresso();
  }, [livro, session?.user.id]);

async function submitComentario(idPost: number, parentId?: number) {
  if (!session?.user?.id) {
    alert("Você precisa estar logado.");
    return;
  }

  // Enviamos tudo para a mesma rota. 
  // Se 'idComentarioSendoEditado' for nulo, a API entende como criação.
  const response = await fetch("../api/comentario/upsert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postagemId: idPost,
      usuarioId: session.user.id,
      texto: comentario,
      parentId: parentId, // preenchido se for uma resposta a outro comentário
      idComentarioSendoEditado: idComentarioSendoEditado, // preenchido se for edição do próprio comentário
    }),
  });

  if (!response.ok) {
    const erro = await response.json();
    alert(JSON.stringify(erro, null, 2));
    return;
  }

  alert(idComentarioSendoEditado !== null ? "Comentário editado!" : "Comentário criado!");

  // Resetar estados
  setIdComentarioSendoEditado(null);
  setComentario("");
  await carregarResenhas();
  setMostrarModalResenha(null);
}

// Lógica separada e exclusiva para DELETAR (atrelada ao estado apagarComentario que você já possui)
useEffect(() => {
  async function deletarComentario() {
    if (apagarComentario === -1) return;

    const req = await fetch("../api/comentario/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comentarioId: apagarComentario,
      }),
    });

    if (!req.ok) {
      const erro = await req.json();
      alert(JSON.stringify(erro, null, 2));
    } else {
      alert("Comentário apagado com sucesso!");
      await carregarResenhas();
      setMostrarModalResenha(null);
    }
    setApagarComentario(-1);
  }
  deletarComentario();
}, [apagarComentario]);

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
      headers: { "Content-Type": "application/json" },
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
      alert(JSON.stringify(erro, null, 2));
      return;
    }

    setMostrarModalResenhaCreate(false);
    setResenha("");
    setNota(0);
    setSpoiler(false);
    await carregarResenhas();
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
  }, [id]);
  
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

  async function curtir(postagemId: number, curtido: boolean, curtidaId: number ) {
    if (!session?.user.id) return;

    if (curtido) {
      await fetch("../api/curtida/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curtidaId }),
      });
    } else {
      await fetch("../api/curtida/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: session.user.id,
          postagemId,
        }),
      });
    }
    await carregarResenhas();
  }
      
  async function curtirComentario(comentarioId: number, curtido: boolean, curtidaId: number) {
    if (!session?.user?.id) return;

    try {
      if (curtido) {
        await fetch("/api/curtida/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ curtidaId }),
        });
      } else {
        await fetch("/api/curtida/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: session.user.id,
            comentarioId,
          }),
        });
      }
      await carregarResenhas();
    } catch (error) {
      console.error("Erro ao processar curtida do comentário:", error);
    }
  }
  
const notaMediaLivro =
  resenhas.length === 0
    ? 0
    : resenhas.reduce((soma, r) => soma + (r.nota ?? 0), 0) / resenhas.length;
 return (
  livro ? (
    <>
      {/* Topo do livro */}
      {informacoesDoLivro(
        livro,
        notaMediaLivro,
        id,
        setMostrarModalDeletar, 
        (dados) => setLivro((prev) => prev ? { ...prev, biblioteca: dados } : prev),
        adm
      )}
      
      {/* Barra de Ações - Removemos o botão "Ver Resenhas" antigo */}
      <div className="w-4xl m-auto flex justify-end gap-3 mb-6">
        {livro?.biblioteca?.status === "LIDO" && (
          <button
            className="px-5 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            onClick={() => setMostrarModalResenhaCreate(true)}
          >
            Escrever Resenha
          </button>
        )}

        {livro?.biblioteca?.status === "LENDO" && (
          <button
            className="px-5 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            onClick={() => setModalProgresso(true)}
          >
            Adicionar progresso
          </button>
        )}
      </div>
      
      {/* Seção Fixa de Resenhas na Página */}
      <div className="w-4xl m-auto border-t border-slate-100 pt-8 my-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Resenhas dos Leitores</h2>

        {/* Paginação incorporada como parte estrutural da página */}
        <Paginacao
          isModal={false}
          paginaAtual={pagina}
          totalPaginas={totalPaginas}
          onPaginaChange={(novaPagina) => setPagina(novaPagina)}
        >
          <div className="space-y-4">
            {resenhas.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">
                Nenhuma resenha encontrada para este livro. Seja o primeiro a comentar!
              </p>
            ) : (
              resenhas.map((resenha) => (
                <ResenhaCard
                  key={resenha.id}
                  resenha={resenha}
                  onClick={setMostrarModalResenha}
                  curtir={curtir}
                />
              ))
            )}
          </div>
        </Paginacao>
      </div>

        {/* Criar resenha (usuário) */}
        {mostrarModalResenhaCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Nova Resenha</h2>
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
                        valor <= nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div>
                  <label className="block mb-1 font-medium">Título</label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Resenha</label>
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
        
        {/* Modal de exclusão do livro (adm) */}
        {mostrarModalDeletar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg min-w-sm">
              <h2 className="text-lg font-semibold mb-4">Confirmar exclusão</h2>
              <p className="mb-6">Tem certeza que deseja apagar este livro?</p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setMostrarModalDeletar(false)}
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

        {/* Modal detalhado da resenha (Comentários e curtidas) */}
        {mostrarModalResenha && (
        <ResenhaModal
          resenha={mostrarModalResenha}
          comentario={comentario}
          onChangeComentario={setComentario}
          onSubmitComentario={submitComentario}
          onClose={() => {
            setMostrarModalResenha(null);
            setIdComentarioSendoEditado(null);
            setComentario("");
          }}
          curtir={curtir}
          onCurtirComentario={curtirComentario}
          idComentarioSendoEditado={idComentarioSendoEditado}
          setIdComentarioSendoEditado={setIdComentarioSendoEditado}
          setApagarComentario={setApagarComentario}
        />
      )}

        {/* Modal de Progresso */}
        {modalProgresso && (
          <Modal open={modalProgresso} onClose={() => setModalProgresso(false)}>
            <ProgressoForm livro={livro} progresso={progresso} onClose={() => setModalProgresso(false)} onSave={(dados: any|null) => carregarProgresso}/>
          </Modal>
        )}
      </>      
    ) : ''
  );
}

function informacoesDoLivro(
  livro: LivroDetalhes,
  notaMediaLivro: number,
  id: string,
  setMostrarModal: (value: boolean) => void,
  setBiblioteca: (value: Biblioteca) => void,
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
            <BibliotecaButton livro={livro} buttonStyle={buttonStyle} onUpdate={setBiblioteca}/>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h1 className="font-bold text-xl">{livro.titulo}</h1>
          <p>{livro.autores.map(a => a.nome).join(", ")}</p>

          {livro.colecao && (
            <Link href={`/colecao/${livro.colecao.id}`} className="text-blue-600 hover:underline">
              {livro.colecao.nome} #{livro.posicao_colecao}
            </Link>
          )}


            <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((valor) => {
              const preenchimento = Math.max(0,Math.min(1, notaMediaLivro - (valor - 1)));
              const tamanhoEstrela = 20;

              return ( 
                <div key={valor} className={"relative w-[" + tamanhoEstrela + "px] h-[" + tamanhoEstrela + "px]"}>
                {/* <div key={valor} className="relative w-[25px] h-[25px]"> */}
                  {/* estrela vazia */}
                  <Star
                    size={tamanhoEstrela}
                    className="absolute text-slate-300"
                  />

                  {/* parte preenchida */}
                  <div
                    className="absolute overflow-hidden"
                    style={{ width: `${preenchimento * 100}%` }}
                  >
                    <Star
                      size={tamanhoEstrela}
                      className="fill-amber-400 text-amber-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>
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