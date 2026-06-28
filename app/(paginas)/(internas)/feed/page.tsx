'use client'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FeedCard from "@/components/feed/feedCard";
import FeedDetailsModal from "@/components/feed/feedDetailsModal";
import Paginacao from "@/components/paginacao";

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [postSelecionado, setPostSelecionado] = useState<any | null>(null);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // Carrega todas as postagens globais do feed
  async function carregarFeed() {
    try {
      // setLoading(true);
      const response = await fetch(`/api/feed/get?pagina=${pagina}`);

      if (!response.ok) {
          setPosts([]);
        return null;
      }

      const data = await response.json();

      // Ajustado para 'resenhas' e 'totalPaginas' conforme o retorno modificado do backend
      setTotalPaginas(data.totalPaginas || 1);
      setPosts(data.resenhas || []);

      return data;
    } catch (error) {
      console.error("Erro ao carregar o feed:", error);
      setPosts([]);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Monitora tanto o carregamento inicial quanto a mudança de páginas
  useEffect(() => {
    carregarFeed();
  }, [pagina]);

  async function handleComentarioSubmit(postId: number, comentId?: number ) {
    if (!session?.user?.id) {
      alert("Você precisa estar logado para comentar.");
      return;
    }

    try {
      const response = await fetch("../api/comentario/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postagemId: postId,
          comentarioId: comentId,
          usuarioId: session.user.id,
          texto: comentario,
        }),
      });

      if (response.ok) {
        setComentario(""); 
        const dadosAtualizados = await carregarFeed();

        // Atualiza o modal aberto com os novos comentários baseando-se na lista atualizada
        if (postSelecionado && dadosAtualizados?.resenhas) {
          const postAtualizado = dadosAtualizados.resenhas.find((p: any) => p.id === postId);
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
            comentarioId,
          }),
        });
        if (!response.ok) return;
      }

      const novosDados = await carregarFeed();

      if (postSelecionado && novosDados?.resenhas) {
        const atualizado = novosDados.resenhas.find(
          (p: any) => p.id === postSelecionado.id
        );

        if (atualizado) {
          setPostSelecionado(atualizado);
        }
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
        <div className="max-w-2xl mx-auto"> 
          {/* Passamos o isModal={false} para ele se comportar como parte da página */}
          <Paginacao
            isModal={false}
            paginaAtual={pagina}         
            totalPaginas={totalPaginas}   
            onPaginaChange={(novaPagina) => setPagina(novaPagina)}
          >
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
          </Paginacao>
        </div>
      )}

      {/* O Modal de Detalhes continua abrindo por cima normalmente quando um card for clicado */}
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