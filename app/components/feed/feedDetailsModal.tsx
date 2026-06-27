'use client'

import { X, Heart, MessageSquare, Send, CornerDownRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {
  post: any;
  comentarioTexto: string;
  onChangeComentario: (text: string) => void;
  onSubmitComentario: (postId: number, comentarioId?: number | null) => void;
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

  console.log("curtidas", post.curtidas);

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


  // Separa os comentários principais (parentId === null) das respostas
  const comentariosPrincipais = post.comentarios?.filter((c: any) => c.parentId === null) || [];
  // console.log(comentariosPrincipais);
  const respostas = post.comentarios?.filter((c: any) => c.parentId !== null) || [];

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
                  <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded font-medium">
                    Avaliação: {post.nota}/5 Estrelas
                  </span>
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
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <MessageSquare size={16} /> Comentários ({post.comentarios?.length || 0})
            </h4>
            
            <div className="space-y-4 mb-6">
              {/* FILTRO CRUCIAL: Só entram aqui comentários que NÃO possuem um pai (parentId nulo/undefined) */}
              {post.comentarios && post.comentarios.filter((c: any) => !c.parentId).length > 0 ? (
                post.comentarios
                  .filter((c: any) => !c.parentId) // Garante que posts filhos não virem posts principais
                  .map((com: any) => {
                    
                    // 1. Puxa as curtidas internas trazidas pelo Prisma para este comentário específico
                    const curtidasDesteComentario = com.curtidas || [];
                    const qtdCurtidasComent = curtidasDesteComentario.length;

                    // 2. Localiza se o usuário atual curtiu
                    const curtidaDoUsuario = curtidasDesteComentario.find(
                      (c: any) => c.usuarioId === session?.user?.id
                    );
                    
                    const jaCurtido = !!curtidaDoUsuario;
                    const idDaCurtida = curtidaDoUsuario ? curtidaDoUsuario.id : -1;

                    // 3. Busca as respostas associadas a ESTE comentário específico na lista geral do post
                    const respostasDesteComentario = post.comentarios?.filter(
                      (r: any) => r.parentId === com.id
                    ) || [];

                    return (
                      <div key={com.id} className="bg-slate-50/60 p-3 rounded-lg border border-slate-100 space-y-2">
                        <div className="flex gap-3 items-start">
                          <img 
                            src={com.usuario?.foto || "https://via.placeholder.com/150"} 
                            alt="" 
                            className="w-7 h-7 rounded-full object-cover mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold text-slate-800">{com.usuario?.nome}</span>
                              <span className="text-[10px] text-slate-400">@{com.usuario?.username}</span>
                            </div>
                            <p className="text-slate-600 text-xs leading-normal">{com.texto}</p>
                          </div>
                        </div>

                        {/* Ações do Comentário (Curtir e Responder) */}
                        <div className="flex items-center gap-4 pl-10 text-[11px] font-semibold text-slate-500">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCurtirComentario(com.id, jaCurtido, idDaCurtida);
                            }}
                            className={`flex items-center gap-1 hover:text-red-500 transition-colors ${jaCurtido ? "text-red-500 font-bold" : ""}`}
                          >
                            <Heart size={12} className={jaCurtido ? "fill-red-500 text-red-500" : ""} />
                            <span>{qtdCurtidasComent}</span>
                          </button>
                          
                          <button 
                            type="button"
                            onClick={() => setReplyTo({ id: com.id, username: com.usuario?.username || "" })}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <MessageSquare size={12} />
                            <span>Responder</span>
                          </button>
                        </div>

                        {/* Renderiza as Respostas Vinculadas de forma aninhada */}
                        {respostasDesteComentario.length > 0 && (
                          <div className="pl-6 pt-2 space-y-2 border-l-2 border-slate-200 ml-3">
                            {respostasDesteComentario.map((resp: any) => {
                              // Se você quiser tratar curtidas nas respostas futuramente, a estrutura já está pronta aqui
                              return (
                                <div key={resp.id} className="flex gap-2 items-start bg-white p-2 rounded border border-slate-100">
                                  <img src={resp.usuario?.foto || "https://via.placeholder.com/150"} className="w-5 h-5 rounded-full object-cover" alt="" />
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-bold text-slate-800">{resp.usuario?.nome}</span>
                                      <span className="text-[9px] text-slate-400">@{resp.usuario?.username}</span>
                                    </div>
                                    <p className="text-slate-600 text-xs">{resp.texto}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>
              )}
            </div>
          </div>
        </div>

        {/* Input Fixo de Criar Comentário / Resposta */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          {replyTo && (
            <div className="flex justify-between items-center bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-md font-medium">
              <span className="flex items-center gap-1">
                <CornerDownRight size={14} /> Respondendo a @{replyTo.username}
              </span>
              <button onClick={() => setReplyTo(null)} className="text-blue-500 hover:text-blue-700">
                <X size={14} />
              </button>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitComentario(post.id, replyTo?.id || null);
              setReplyTo(null);
            }}
            className="flex gap-2 items-center"
          >
            <input 
              type="text"
              value={comentarioTexto}
              onChange={(e) => onChangeComentario(e.target.value)}
              placeholder={replyTo ? `Sua resposta para @${replyTo.username}...` : "Escreva seu comentário..."}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex-shrink-0">
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}