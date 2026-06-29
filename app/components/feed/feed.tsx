'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import FeedCard from "@/components/feed/feedCard";
import FeedDetailsModal from "@/components/feed/feedDetailsModal";
import Paginacao from "@/components/paginacao";

type FeedProps = {
  posts: any[];
  loading: boolean;
  pagina: number;
  totalPaginas: number;
  onPaginaChange: (pagina: number) => void;
  onReload: () => Promise<any[]>;
};

export default function Feed({
  posts,
  loading,
  pagina,
  totalPaginas,
  onPaginaChange,
  onReload,
}: FeedProps) {
  const { data: session } = useSession();
  const [postSelecionado, setPostSelecionado] = useState<any | null>(null);
  const [comentario, setComentario] = useState("");
  
  const [idComentarioSendoEditado, setIdComentarioSendoEditado] = useState<number | null>(null);
  const [apagarComentario, setApagarComentario] = useState<number>(-1);

  async function atualizarFeed() {
    const novosPosts = await onReload();

    if (!postSelecionado) return;

    const atualizado = novosPosts.find(
      (p) => p.id === postSelecionado.id
    );

    if (atualizado) {
      setPostSelecionado(atualizado);
    }
  }

  useEffect(() => {
    async function deletarComentario() {
      if (apagarComentario === -1) return;

      const response = await fetch("/api/comentario/delete", { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comentarioId: apagarComentario,
        }),
      });

      if (!response.ok) {
        alert("Erro ao apagar o comentário.");
      } else {
        alert("Comentário apagado com sucesso!");
        await atualizarFeed();
      }
      
      setApagarComentario(-1);
    }
    deletarComentario();
  }, [apagarComentario]);

  async function handleComentarioSubmit(postId: number, parentId?: number) {
    if (!session?.user?.id) return;

    const response = await fetch("/api/comentario/upsert", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postagemId: postId,
        usuarioId: session.user.id,
        texto: comentario,
        parentId: parentId || null, // Passado explicitamente como parentId para respostas
        idComentarioSendoEditado: idComentarioSendoEditado, // Passado se for alteração do próprio comentário
      }),
    });

    if (!response.ok) {
      alert("Erro ao processar comentário.");
      return;
    }

    alert(idComentarioSendoEditado !== null ? "Comentário editado!" : "Comentário enviado!");

    setComentario("");
    setIdComentarioSendoEditado(null);
    await atualizarFeed();
  }

  async function curtir(
    postagemId: number,
    curtido: boolean,
    curtidaId: number
  ) {
    if (!session?.user?.id) return;

    const response = await fetch(
      curtido ? "/api/curtida/delete" : "/api/curtida/create",
      {
        method: curtido ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          curtido
            ? { curtidaId }
            : {
                postagemId,
                usuarioId: session.user.id,
              }
        ),
      }
    );

    if (!response.ok) return;

    await atualizarFeed();
  }

  async function curtirComentario(
    comentarioId: number,
    curtido: boolean,
    curtidaId: number
  ) {
    if (!session?.user?.id) return;

    const response = await fetch(
      curtido ? "/api/curtida/delete" : "/api/curtida/create",
      {
        method: curtido ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          curtido
            ? { curtidaId }
            : {
                comentarioId,
                usuarioId: session.user.id,
              }
        ),
      }
    );

    if (!response.ok) return;

    await atualizarFeed();
  }

  return (
    <>
      {loading ? (
        <p className="text-center text-sm text-slate-500 mt-10">
          Carregando publicações...
        </p>
      ) : (
        <Paginacao
          isModal={false}
          paginaAtual={pagina}
          totalPaginas={totalPaginas}
          onPaginaChange={onPaginaChange}
        >
          <div className="space-y-4">
            {posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onClick={setPostSelecionado}
                onCurtir={curtir}
              />
            ))}

            {posts.length === 0 && (
              <p className="text-center text-sm text-slate-400 italic mt-12">
                Nenhuma publicação encontrada.
              </p>
            )}
          </div>
        </Paginacao>
      )}

      {postSelecionado && (
      <FeedDetailsModal
        post={postSelecionado}
        comentarioTexto={comentario}
        onChangeComentario={setComentario}
        onSubmitComentario={handleComentarioSubmit}
        onClose={() => {
          setPostSelecionado(null); // Isso aqui fecha o modal de verdade desmuntando o componente
          setIdComentarioSendoEditado(null);
          setComentario("");
        }}
        onCurtir={curtir}
        onCurtirComentario={curtirComentario}
        idComentarioSendoEditado={idComentarioSendoEditado}
        setIdComentarioSendoEditado={setIdComentarioSendoEditado}
        setApagarComentario={setApagarComentario}
      />
)}
    </>
  );
}