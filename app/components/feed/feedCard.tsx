'use client'

import { Star, BookOpen, MessageSquare, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type FeedPost = any; 

type Props = {
  post: FeedPost;
  onClick: (post: FeedPost) => void;
  onCurtir: (postagemId: number, curtido: boolean, curtidaId: number) => void;
};

export default function FeedCard({ post, onClick, onCurtir }: Props) {
  const isProgresso = post.paginaAtual !== null && post.paginaAtual !== undefined;

  const { data: session } = useSession();
  
  // Cálculo da porcentagem de leitura
  const porcentagem = isProgresso && post.livro?.paginas
    ? Math.min(Math.round((post.paginaAtual / post.livro.paginas) * 100), 100)
    : 0;

  const [curtido, setCurtido] = useState(false);
  const [curtidaId, setCurtidaId] = useState(-1);
  const [qtdCurtidas, setQtdCurtidas] = useState(post.curtidas.length);

  useEffect(() => {
    if (!session?.user?.id) return;
    const curtidaDoUsuario = post.curtidas.find(
      (c: { usuarioId: string; id: number }) => c.usuarioId === session.user.id
    );
    
    setCurtido(!!curtidaDoUsuario);
    setCurtidaId(curtidaDoUsuario?.id ?? -1);
    setQtdCurtidas(post.curtidas.length);
  }, [session, post]);

  

  return (
    <div 
      onClick={() => onClick(post)}
        className="min-w-[700px] w-full bg-white max-w-2xl mx-auto mb-6 bg-white border border-amber-300 rounded-xl shadow-sm" // gambiarra que funcionou e n mexer por favor 
    >
      {/* Cabeçalho do Card (Comum a ambos) */}
      <div className="p-5 pb-3 flex items-center gap-3">
        <img 
          src={post.usuario.foto && post.usuario.foto.trim() !== "" ? post.usuario.foto : "https://via.placeholder.com/150"} 
          alt={post.usuario.nome} 
          className="w-10 h-10 rounded-full object-cover border border-slate-200"
        />

        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800 text-sm">{post.usuario.nome}</span>
            <span className="text-xs text-slate-400">@{post.usuario.username}</span>
          </div>
          <p className="text-xs text-slate-500">
            {isProgresso ? (
              <span className="text-blue-600 font-medium flex items-center gap-1 mt-0.5">
                <BookOpen size={12} /> registrou um novo progresso de leitura
              </span>
            ) : (
              <span className="text-amber-600 font-medium flex items-center gap-1 mt-0.5">
                <Star size={12} className="fill-amber-500 text-amber-500" /> escreveu uma resenha
              </span>
            )}
          </p>
        </div>
        <span className="ml-auto text-xs text-slate-400">
          {new Date(post.data).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {(isProgresso && post.texto) && (
        <div className="px-6 pb-2 mt-2">
          {post.temSpoiler ?  
            <p className="inline-block bg-red-100 text-red-700 text-lg font-bold w-full text-center py-1 rounded uppercase mb-2">
              Contém Spoiler
            </p> :
            <p className="line-clamp-2 break-words">
              {post.texto}
            </p>
          }
        </div>
      )}

      <div className="px-5 pb-4">
        {isProgresso ? (
          layoutProgresso(post, porcentagem)
        ) : (
          layoutResenha(post)     
        )}
      </div>

      {/* Rodapé do Card */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex gap-6 text-slate-500 text-xs">

        <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation();
            setCurtido(c => !c);                          
            setQtdCurtidas((q:number) => curtido ? q - 1 : q + 1); 
            onCurtir(post.id, curtido, curtidaId);}} >

          <Heart size={15} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
          <span>{qtdCurtidas} Curtidas</span>
        </button>
        
        <div className="flex items-center gap-1.5">
          <MessageSquare size={15} />
          <span>{post.comentarios?.length || 0} Comentários</span>
        </div>
      </div>
    </div>
  );
}

function layoutProgresso(post: FeedPost, porcentagem: number) {
   return (
    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center gap-4">
      <img 
        src={post.livro.capa} 
        alt={post.livro.titulo} 
        className="w-18 h-25 rounded object-cover shadow-sm flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 text-sm truncate">{post.livro.titulo}</h4>
        <p className="text-xs text-slate-500 mb-2">Página {post.paginaAtual} de {post.livro.paginas}</p>
        
        {/* Barra de Progresso */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
        <span className="text-[11px] font-bold text-blue-600 mt-1 block">{porcentagem}% concluído</span>
      </div>
    </div>
   )
}

function layoutResenha(post: FeedPost) {
  return (
    <div className="relative flex items-center gap-2 border-l-4 border-amber-400 bg-amber-50/40 rounded-r-xl p-3">
        <img src={post.livro.capa} alt="" className="w-18 h-25 rounded object-cover" />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="min-w-0">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1 ">
              {post.livro.titulo}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug truncate">
              {post.titulo}
            </h3>
          </div>
          
          {/* Nota em Estrelas */}
          <div className="flex bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100 shrink-0">
            {[1, 2, 3, 4, 5].map((valor) => (
              <Star
                key={valor}
                size={14}
                className={valor <= (post.nota ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                />
              ))}
          </div>

        </div>
        {post.texto && (
          post.temSpoiler ?
          <p className="bg-red-100 text-red-700 text-lg font-bold w-full text-center py-1 rounded uppercase mb-2">
            Contém Spoiler
          </p> :
          <p className="text-slate-700 text-sm leading-relaxed line-clamp-4 whitespace-pre-wrap font-serif line-clamp-2 break-all">
            {post.texto}
          </p>
        )}
      </div>
    </div>
  )
}