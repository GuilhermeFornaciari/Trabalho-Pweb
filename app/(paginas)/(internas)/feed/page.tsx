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
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Erro ao carregar feed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFeed();
  }, []);

  // Handler para submeter novos comentários
  async function handleComentarioSubmit(postId: number) {
    if (!session?.user?.id) {
      alert("Você precisa estar logado para comentar.");
      return;
    }

    try {
      const response = await fetch("/api/comentario/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postagemId: postId,
          usuarioId: session.user.id,
          texto: comentario,
        }),
      });

      if (response.ok) {
        setComentario("");

        await carregarFeed();
        
        // Atualiza o modal ativo com os novos dados do post atualizado
        const postAtualizado = posts.find((p) => p.id === postId);
        if (postAtualizado) {
          setPostSelecionado(null);
        }
        alert("Comentário adicionado!");
      } else {
        alert("Erro ao adicionar comentário.");
      }
    } catch (error) {
      console.error(error);
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
          onClose={() => {setPostSelecionado(null); carregarFeed();}}
        />
      )}
    </div>
  );
}