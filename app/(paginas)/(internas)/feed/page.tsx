'use client'

import { useEffect, useState } from "react";
import Feed from "@/components/feed/feed";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [filtro, setFiltro] = useState<"recentes" | "Amigos">("recentes");

  function deletePost(postId: number) {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  }

  function updatePost(postAtualizado: any | null) {
    if (!postAtualizado) return;

    setPosts(prev =>
      prev.map(post =>
        post.id === postAtualizado.id
          ? {
              ...post,
              texto: postAtualizado.texto,
              temSpoiler: postAtualizado.temSpoiler,
            }
          : post
      )
    );
  }

  async function carregarFeed() {
    setLoading(true); 
    
    const response = await fetch(`/api/feed/get?pagina=${pagina}&filtro=${filtro}`);
    if (!response.ok) {
      setPosts([]);
      setLoading(false);
      return [];
    }
  
    const data = await response.json();
  
    setPosts(data.resenhas);
    setTotalPaginas(data.totalPaginas);
    setLoading(false);

    return data.resenhas;
  }

  useEffect(() => {
    carregarFeed();
  }, [pagina, filtro]);

  const alterarFiltro = (novoFiltro: "recentes" | "Amigos") => {
    setFiltro(novoFiltro);
    setPagina(1);
  };

  return (
    <div className="py-5 max-w-3xl m-auto">
      {/* Botões de Seleção de Filtro */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        <button
          onClick={() => alterarFiltro("recentes")}
          className={`pb-2 px-1 font-medium text-sm transition-colors ${
            filtro === "recentes"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Recentes
        </button>
        <button
          onClick={() => alterarFiltro("Amigos")}
          className={`pb-2 px-1 font-medium text-sm transition-colors ${
            filtro === "Amigos"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Amigos
        </button>
      </div>

      <Feed
        posts={posts}
        loading={loading}
        pagina={pagina}
        totalPaginas={totalPaginas}
        onPaginaChange={setPagina}
        onReload={carregarFeed}
        onDelete={(postId: number) => deletePost(postId)}
        onEdit={(post: any | null) => updatePost(post)}
      />
    </div>
  );
}