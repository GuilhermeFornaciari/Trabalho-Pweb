'use client'

import { X, Heart, MessageSquare, Send, CornerDownRight, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ComentarioList from "../comentario/comentarioList";
import ComentarioInput from "../comentario/comentarioInput";

type Props = {
  post: any;
  comentarioTexto: string;
  onChangeComentario: (text: string) => void;
  onSubmitComentario: (postId: number, comentarioId?: number) => void;
  onClose: () => void;
  onCurtir: (postagemId: number, curtido: boolean, curtidaId: number) => void;
  onCurtirComentario: (comentarioId: number, curtido: boolean, curtidaId: number) => void;
};

export default function FeedDetailsModal({
  post,
  comentarioTexto,
  onChangeComentario,
  onSubmitComentario,
  onClose,
  onCurtir,
  onCurtirComentario
}: Props) {
  if (!post) return null;
  const isProgresso = post.paginaAtual !== null;

  const { data: session } = useSession();

  // console.log("curtidas", post.curtidas);

  // Curtidas do Post Principal
  const [curtido, setCurtido] = useState(false);
  const [curtidaId, setCurtidaId] = useState(-1);
  const [qtdCurtidas, setQtdCurtidas] = useState(0);

  const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);

  useEffect(() => {
    if (!post.curtidas) return;

    // Filtra apenas as curtidas que pertencem ao Post (onde comentarioId é null)
    const curtidasDoPost = post.curtidas.filter((c: any) => c.comentarioId === null || c.comentarioId === undefined);
    setQtdCurtidas(curtidasDoPost.length);

    if (session?.user?.id) {
      const curtidaDoUsuario = curtidasDoPost.find((c: any) => c.usuarioId === session.user.id);
      setCurtido(!!curtidaDoUsuario);
      setCurtidaId(curtidaDoUsuario?.id ?? -1);
    }
  }, [session, post]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header do Modal */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <img src={post.usuario.foto && post.usuario.foto.trim() !== "" ? post.usuario.foto : "https://via.placeholder.com/150"} 
              alt="" 
              className="w-8 h-8 rounded-full object-cover" 
            />
            <span className="text-sm font-semibold text-slate-700">Publicação de @{post.usuario.username}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Post Principal */}
          <div>
            <div className="flex gap-4 items-start mb-4">
              <img src={post.livro.capa} alt="" className="w-20 h-30 rounded shadow-md object-cover flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{post.livro.titulo}</h2>
                <p className="text-xs text-slate-500 mb-2">Autor(es) vinculados ao livro</p>
                {isProgresso ? (
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                    Progresso: Página {post.paginaAtual} de {post.livro.paginas}
                  </span>
                ) : (
                  <div className="flex -translate-y-0.5">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <Star
                        key={valor}
                        size={14}
                        className={
                          valor <= (post.nota ?? 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!isProgresso && <h3 className="text-lg font-bold text-slate-800 mb-2">{post.titulo}</h3>}
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-serif bg-slate-50 p-4 rounded-xl border border-slate-100">
              {post.texto}
            </p>
          </div>

          {/* Botão Curtir Post */}
          <div className="pt-2 flex items-center gap-4">
            <button onClick={(e) => { 
              e.stopPropagation();
              setCurtido(c => !c);                          
              setQtdCurtidas((q) => curtido ? q - 1 : q + 1); 
              onCurtir(post.id, curtido, curtidaId);
            }}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors bg-slate-100 px-4 py-2 rounded-full">
              <Heart size={16} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
              <span>{qtdCurtidas} Curtidas</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Seção de Comentários */}
          <ComentarioList 
            onChangeComentario={onChangeComentario}
            onCurtirComentario={onCurtirComentario}
            resenha={post}
            setReplyTo={setReplyTo}
          />

          
        </div>

        {/* Input Fixo de Criar Comentário / Resposta */}
        <ComentarioInput
          comentario={comentarioTexto}
          onChangeComentario={onChangeComentario}
          onSubmitComentario={onSubmitComentario}
          replyTo={replyTo}
          postId={post.id}
          setReplyTo={setReplyTo}
        />

      </div>
    </div>
  );
}