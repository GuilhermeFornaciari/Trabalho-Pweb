import Link from "next/link";
import { Star, Heart, X, MessageSquare, CornerDownRight, Send } from "lucide-react";
import { Postagem } from "@/lib/prisma/generated/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  curtidas: any[];
  comentarios?: any[]; // Incluído para listar os comentários se já vierem no objeto
};

type Props = {
  resenha: ResenhaDetalhes;
  comentario: string;
  onChangeComentario: (texto: string) => void;
  onSubmitComentario: (idResenha: number, comentarioId?: number | null) => void;
  onClose: () => void;
  curtir: (postagemId: number, curtido: boolean, curtidaId: number) => void;
  onCurtirComentario: (comentarioId: number, curtido: boolean, curtidaId: number) => void;

};

export default function ResenhaModal({
  resenha,
  comentario,
  onChangeComentario,
  onSubmitComentario,
  onClose,
  curtir,
  onCurtirComentario,
}: Props) {

   const { data: session } = useSession();
    
        const [curtido, setCurtido] = useState(false);
        const [curtidaId, setCurtidaId] = useState(-1);
        const [qtdCurtidas, setQtdCurtidas] = useState(resenha.curtidas.length);
    
        useEffect(() => {
          if (!session?.user?.id) return;
    
          const curtidaDoUsuario = resenha.curtidas.find(
            (curtida: { usuarioId: string; id: number }) =>
              curtida.usuarioId === session.user.id
          );
    
          setCurtido(!!curtidaDoUsuario);
          setCurtidaId(curtidaDoUsuario?.id ?? -1);
          setQtdCurtidas(resenha.curtidas.length);
        }, [session, resenha]);


        const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);
      

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Topo do Modal */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <Link 
            href={"/perfil/" + resenha.usuario.username} 
            className="text-xs font-semibold text-slate-500 hover:underline"
          >
            @{resenha.usuario.username}
          </Link>
          <button
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo com scroll independente */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-800">{resenha.titulo}</h2>

            <div className="flex -translate-y-0.5">
              {[1, 2, 3, 4, 5].map((valor) => (
                <Star
                  key={valor}
                  size={16}
                  className={
                    valor <= (resenha.nota ?? 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }
                />
              ))}
            </div>

          </div>

          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-serif bg-slate-50 p-4 rounded-xl border border-slate-100">
            {resenha.texto}
          </p>

          <div className="pt-2">
            <button onClick={(e) => {e.stopPropagation();
              setQtdCurtidas((q:number) => curtido ? q - 1 : q + 1); 
              setCurtido(c => !c)
              curtir(resenha.id, curtido, curtidaId);}} className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
              <Heart size={15} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
              <span>{qtdCurtidas}</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Seção de Comentários */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <MessageSquare size={16} /> Comentários ({resenha.comentarios?.length || 0})
            </h4>
            
            <div className="space-y-4 mb-6">
              {/* Comentários que NÃO possuem um pai*/}
              {resenha.comentarios && resenha.comentarios.filter((c: any) => !c.parentId).length > 0 ? (
                resenha.comentarios.filter((c: any) => !c.parentId).map((com: any) => {
                    
                    // 1. Puxa as curtidas internas trazidas pelo Prisma para este comentário específico
                    const curtidasDesteComentario = com.curtidas || [];
                    const qtdCurtidasComent = curtidasDesteComentario.length;

                    // 2. Localiza se o usuário atual curtiu
                    const curtidaDoUsuario = curtidasDesteComentario.find(
                      (c: any) => c.usuarioId === session?.user?.id
                    );
                    
                    const jaCurtido = !!curtidaDoUsuario;
                    const idDaCurtida = curtidaDoUsuario ? curtidaDoUsuario.id : -1;

                    // 3. Busca as respostas associadas a ESTE comentário específico na lista geral do resenha
                    const respostasDesteComentario = resenha.comentarios?.filter(
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
                              
                              // 1. Puxa as curtidas específicas desta RESPOSTA
                              const curtidasDestaResposta = resp.curtidas || [];
                              const qtdCurtidasResposta = curtidasDestaResposta.length;

                              // 2. Verifica se o usuário logado curtiu esta resposta específica
                              const curtidaDoUsuario = curtidasDestaResposta.find(
                                (c: any) => c.usuarioId === session?.user?.id
                              );
                              
                              const respostaJaCurtida = !!curtidaDoUsuario;
                              const idDaCurtidaResposta = curtidaDoUsuario ? curtidaDoUsuario.id : -1;

                              return (
                                <div key={resp.id} className="bg-white p-2.5 rounded border border-slate-100 space-y-1.5">
                                  <div className="flex gap-2 items-start">
                                    <img 
                                      src={resp.usuario?.foto || "https://via.placeholder.com/150"} 
                                      className="w-5 h-5 rounded-full object-cover mt-0.5" 
                                      alt="" 
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 mb-0.5">
                                        <span className="text-[11px] font-bold text-slate-800">{resp.usuario?.nome}</span>
                                        <span className="text-[9px] text-slate-400">@{resp.usuario?.username}</span>
                                      </div>
                                      <p className="text-slate-600 text-xs leading-normal">{resp.texto}</p>
                                    </div>
                                  </div>

                                  {/* Ações da Resposta (Curtir e Responder de dentro) */}
                                  <div className="flex items-center gap-3 pl-7 text-[10px] font-semibold text-slate-500">
                                    {/* Botão Curtir */}
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onCurtirComentario(resp.id, respostaJaCurtida, idDaCurtidaResposta);
                                      }}
                                      className={`flex items-center gap-1 hover:text-red-500 transition-colors ${respostaJaCurtida ? "text-red-500 font-bold" : ""}`}
                                    >
                                      <Heart size={10} className={respostaJaCurtida ? "fill-red-500 text-red-500" : ""} />
                                      <span>{qtdCurtidasResposta}</span>
                                    </button>

                                    {/* Responder a um comentário de dentro */}
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        // Mantém o parentId como o ID do comentário raiz (com.id) para o banco agrupar na mesma árvore
                                        setReplyTo({ id: com.id, username: resp.usuario?.username || "" });
                                        onChangeComentario(`@${resp.usuario?.username} `);
                                      }}
                                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                    >
                                      <MessageSquare size={10} />
                                      <span>Responder</span>
                                    </button>
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
              onSubmitComentario(resenha.id, replyTo?.id || null);
              setReplyTo(null);
            }}
            className="flex gap-2 items-center"
          >
            <input 
              type="text"
              value={comentario}
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