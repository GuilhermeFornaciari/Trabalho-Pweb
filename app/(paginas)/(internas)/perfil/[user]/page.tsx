'use client'

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { User, Biblioteca, Livro } from "@/lib/prisma/generated/client";
import { useSession } from "next-auth/react";
import EditarUsuario from "@/components/usuario/editarForm";
import Modal from "@/components/modal";
import BibliotecaContainer from "@/components/biblioteca/bibliotecaContainer";
import EstatisticasPerfil from "@/components/estatistica/estatisticaUsuario";
import Feed from "@/components/feed/feed";

export type UsuarioPerfil = User & {
  biblioteca: (Biblioteca & {
    livro: Livro;
    nota: number | null;
    progresso: number | null;
  })[];
};

type AbaDisponivel = 'biblioteca' | 'postagens' | 'estatisticas';


export default function PerfilPage({params,}: {params: Promise<{ user: string }>}) {
  const {user} = use(params);
  const [loadingPage, setLoadingPage] = useState(true);
  const { data: session } = useSession();
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioPerfil>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [abaAtiva, setAbaAtiva] = useState<AbaDisponivel>('biblioteca');
  const conteudos = {
    biblioteca: biblioteca(usuario),
    postagens: postagens(posts, loadingPosts, pagina, totalPaginas, setPagina, carregarFeed, deletePost, updatePost),
    estatisticas: estatisticas(usuario),
  };
  
  function deletePost(postId: number) {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
  }

  function updatePost(postAtualizado: any | null) {
    setPosts((prev) => {
      if (!postAtualizado) return prev;

      return prev.map((post) =>
        post.id === postAtualizado.id ? postAtualizado : post
      );
    });
  }

  useEffect(() => {
    setLoadingPage(true);
    const carregarUsuario = async () => {
      const response = await fetch(`../api/usuario/${user}`);
      
      if(response.ok){
        const data = await response.json();
        setUsuario(data.dados);
      }
      setLoadingPage(false);
    };
    
    carregarUsuario();
  }, [refreshKey]);
  
  useEffect(() => {
    if (modalAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = ""; 
    };
  }, [modalAberto]);
  
  useEffect(() => {
    if(!usuario) return;
    carregarFeed();
  }, [usuario, pagina]);

  async function carregarFeed() {
    setLoadingPosts(true);
    if(!usuario?.id) return;

    const response = await fetch(`/api/usuario/posts?usuarioId=${usuario.id}&pagina=${pagina}&quantidade=5`);
    if (!response.ok) {
      setPosts([]);
      return [];
    }
  
    const data = await response.json();
  
    setPosts(data.dados.posts);
    setTotalPaginas(data.dados.totalPaginas);
    setLoadingPosts(false);

    return data.dados.posts;
  }

  if(loadingPage) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-center">Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-100">
      <div className="w-5xl mx-auto px-4 py-10">
      {/* Cabeçalho do perfil */}
        <div className="flex items-start justify-around gap-13 pb-8 border-b border-amber-400 w-full bg-white p-3 rounded-lg">
          {/* Foto */}
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="relative flex-shrink-0">
              <img
                src={usuario?.foto || "/temp/caju.jpeg"}
                alt="Foto do usuário"
                
                className="rounded-full object-cover border-4 border-[#F7D774] w-[250px] h-[250px]"
                />
            </div>
            { session?.user.id === usuario?.id && 
              (
                <button
                onClick={() => setModalAberto(true)}
                className="px-4 py-1.5 rounded-lg bg-[#F7D774] hover:bg-[#F2CF5A] transition text-sm font-semibold text-[#4F442E]"
                >
                  Editar perfil
                </button>
              )
            }
          </div>
          {/* Infos */}
          <div className="flex flex-col flex-1 items-start gap-3 py-5">
              <h1 className="text-3xl font-semibold text-[#4F442E]">{usuario?.nome} <span className="text-gray-400 font-light text-2xl">@{usuario?.username}</span></h1>
              {usuario?.dataNascimento && (
                <span className="text-[#8A7A5B] text-sm">
                  {new Date().getFullYear() - new Date(usuario.dataNascimento).getFullYear()} anos
                </span>
              )}
            <p className="text-[#8A7A5B] text-sm max-w-xs"> {usuario?.bio} </p>
          </div>
        </div>

          {(modalAberto && session?.user.id === usuario?.id)  && 
            (
              <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
                <EditarUsuario
                  usuario={usuario}
                  onClose={() => setModalAberto(false)}
                  onRefresh={() => setRefreshKey((prev) => prev + 1)}
                />
              </Modal>
            )
          }

        {/* Sistema de Abas */}
        <div className="">
          {/* Botões de Seleção das Abas */}
          <div className="flex justify-center gap-4">
            {(['biblioteca', 'postagens', 'estatisticas'] as AbaDisponivel[]).map((aba) => (
              <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all capitalize
                ${abaAtiva === aba 
                  ? 'bg-[#F7D774] text-[#4F442E] shadow-sm' 
                  : 'text-[#8A7A5B] hover:bg-[#F7D774]/20'
                }`}
              >
                {aba}
              </button>
            ))}
          </div>

          {/* Conteúdo Dinâmico baseado na Aba Ativa */}
          <div className="text-[#8A7A5B] border-t border-amber-400 text-sm min-h-[200px] bg-white p-3 rounded-lg">
            {conteudos[abaAtiva]}
          </div>
        </div>

      </div>
    </div>
  );
}

function biblioteca(usuario: UsuarioPerfil | undefined) {
  if(!usuario) return null;

  return (
    <div className="flex flex-wrap justify-center"> 
      <BibliotecaContainer livros={usuario?.biblioteca}/>
    </div>
  );
}

function postagens(
  posts: any[],
  loadingPosts: boolean,
  pagina: number,
  totalPaginas: number,
  onPaginaChange: (pagina: number) => void,
  onReload: () => Promise<any[]>,
  onDelete: (postId: number) => void,
  onEdit: (post: any | null) => void
) {
  return (
    <div className="max-w-3xl m-auto">
      <Feed
        posts={posts}
        loading={loadingPosts}
        pagina={pagina}
        totalPaginas={totalPaginas}
        onPaginaChange={onPaginaChange}
        onReload={onReload}
        onDelete={(postId: number) => onDelete(postId)}
        onEdit={(post: any | null) => onEdit(post)}
      />
    </div>
  );
} 

function estatisticas(usuario: UsuarioPerfil | undefined) {
  if(!usuario) return null;

  return (
    <div>
        <EstatisticasPerfil usuario={usuario} />
    </div>
  );
}