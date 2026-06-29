'use client'

import { useEffect, useState } from "react";
import Feed from "@/components/feed/feed";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  async function carregarFeed() {
    const response = await fetch(`/api/feed/get?pagina=${pagina}`);
    if (!response.ok) {
    setPosts([]);
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
  }, [pagina]);

  return (
    <div className="py-5 max-w-3xl m-auto">
      <Feed
        posts={posts}
        loading={loading}
        pagina={pagina}
        totalPaginas={totalPaginas}
        onPaginaChange={setPagina}
        onReload={carregarFeed}
        />
    </div>
  );
}