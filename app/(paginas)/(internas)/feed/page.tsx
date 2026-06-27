'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FeedCard from "@/components/feed/feedCard";
import FeedDetailsModal from "@/components/feed/feedDetailsModal";

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<any | null>(null);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);

  // Carrega todas as postagens globais do feed
  async function carregarFeed() {
    try {
      const response = await fetch("/api/feed/get");

      if (!response.ok) return [];

      const data = await response.json();
      setPosts(data);

      return data;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFeed();
  }, []);

  async function handleComentarioSubmit(postId: number, comentId?: number | null) {
    if (!session?.user?.id) {
      alert("Você precisa estar logado para comentar.");
      return;
    }

    console.log("Comentario id:", comentId);

    try {
      const response = await fetch("/api/comentario/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postagemId: postId,
          comentarioId: comentId || null, // Se vier preenchido, vira uma resposta. Se não, comentário raiz do post.
          usuarioId: session.user.id,
          texto: comentario, // Certifique-se de que o nome dessa variável de estado bate com o seu useState
        }),
      });

      if (response.ok) {
        setComentario(""); // Limpa o input
        await carregarFeed();

        // Atualiza o modal aberto com os novos dados se necessário
        if (postSelecionado) {
          const postAtualizado = posts.find((p) => p.id === postId);
          if (postAtualizado) {
            setPostSelecionado(postAtualizado);
          }
        }
        alert("Comentário adicionado!");
      } else {
        alert("Erro ao adicionar comentário.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function curtir(postagemId: number, curtido: boolean, curtidaId: number) {
    if (!session?.user?.id) return;

    if (curtido) {
      const response = await fetch("/api/curtida/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curtidaId }),
      });
      if (!response.ok) return;
    } else {
      const response = await fetch("/api/curtida/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuarioId: session.user.id,
          postagemId,
        }),
      });
      if (!response.ok) return;
    }

    await carregarFeed();
  }

  async function curtirComentario(comentarioId: number, curtido: boolean, curtidaId: number) {
    if (!session?.user?.id) return;

    try {
      if (curtido) {
        // Deleta a curtida usando o ID dela
        const response = await fetch("/api/curtida/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ curtidaId }),
        });
        if (!response.ok) return;
      } else {
        // Cria a curtida omitindo postagemId para o Zod validar como comentário
        const response = await fetch("/api/curtida/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: session.user.id,
            comentarioId,
          }),
        });
        if (!response.ok) return;
      }

      // Recarrega os dados globais
      const novosPosts = await carregarFeed();

      if (postSelecionado) {
        const atualizado = novosPosts.find(
          (p: any) => p.id === postSelecionado.id
        );

        if (atualizado) {
          setPostSelecionado(atualizado);
        }
        console.log(atualizado?.curtidas);
      }

      
    } catch (error) {
      console.error("Erro ao processar curtida do comentário:", error);
    }
  }



  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4">
      <div className="max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Feed Literário</h1>
        <p className="text-sm text-slate-500">Veja o que seus amigos estão lendo e criticando.</p>
      </div>

      {loading ? (
        <p className="text-center text-sm text-slate-500 mt-10">Carregando publicações...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedCard 
              key={post.id} 
              post={post} 
             onClick={(p) => setPostSelecionado(p)} 
             onCurtir={curtir} 
            />
          ))}

          {posts.length === 0 && (
            <p className="text-center text-sm text-slate-400 italic mt-12">Nenhuma atividade no momento.</p>
          )}
        </div>
      )}

      {/* Modal de Detalhes Expandidos */}
      {postSelecionado && (
      <FeedDetailsModal
        post={postSelecionado}
        comentarioTexto={comentario}
        onChangeComentario={setComentario}
        onSubmitComentario={handleComentarioSubmit}
        onClose={() => { setPostSelecionado(null) }}
        onCurtir={curtir}
        onCurtirComentario={curtirComentario}
      />
    )}
    </div>
  );
}