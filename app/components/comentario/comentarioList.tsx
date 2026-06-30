import { Postagem } from "@/lib/prisma/generated/client";
import { Heart, MessageSquare, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  curtidas: any[];
  comentarios?: any[]; 
};

type Props = {
  resenha: ResenhaDetalhes;
  onChangeComentario: (texto: string) => void;
  onCurtirComentario: (comentarioId: number, curtido: boolean, curtidaId: number) => void;
  setReplyTo: (value: { id: number; username: string } | null) => void;
  idComentarioSendoEditado: number | null;
  setIdComentarioSendoEditado: (id: number | null) => void;
  setApagarComentario: (value: number) => void;
};

export default function ComentarioList({ 
  resenha, 
  onCurtirComentario, 
  onChangeComentario, 
  setReplyTo, 
  idComentarioSendoEditado,
  setIdComentarioSendoEditado, 
  setApagarComentario 
}: Props) {
  const { data: session } = useSession();
  const [comentarioMenuAbertoId, setComentarioMenuAbertoId] = useState<number | null>(null);

  return (
    <div>
      <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
        <MessageSquare size={16} /> Comentários ({resenha.comentarios?.length || 0})
      </h4>
      
      <div className="space-y-4 mb-6">
        {resenha.comentarios && resenha.comentarios.filter((c: any) => !c.parentId).length > 0 ? (
          resenha.comentarios.filter((c: any) => !c.parentId).map((com: any) => {
              
            const curtidasDesteComentario = com.curtidas || [];
            const qtdCurtidasComent = curtidasDesteComentario.length;

            const curtidaDoUsuario = curtidasDesteComentario.find(
              (c: any) => c.usuarioId === session?.user?.id
            );
            
            const jaCurtido = !!curtidaDoUsuario;
            const idDaCurtida = curtidaDoUsuario ? curtidaDoUsuario.id : -1;

            const respostasDesteComentario = resenha.comentarios?.filter(
              (r: any) => r.parentId === com.id
            ) || [];

            return (
              /* COMENTÁRIO PAI (relative e pr-8 para o texto não passar por baixo do botão) */
              <div key={com.id} className="bg-slate-50/60 p-3 pr-8 rounded-lg border border-slate-100 space-y-2 relative">
                
                {/* Botão 3 Pontinhos do Comentário Pai */}
                {session?.user?.id === com.usuarioId && (
                  <div className="absolute top-3 right-2">
                    <button 
                      onClick={() => setComentarioMenuAbertoId(comentarioMenuAbertoId === com.id ? null : com.id)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {comentarioMenuAbertoId === com.id && (
                      <MenuTresPontinhos 
                        idComentarioSendoEditado={idComentarioSendoEditado}
                        setIdComentarioSendoEditado={setIdComentarioSendoEditado}
                        setApagarComentario={setApagarComentario}
                        idComentario={com.id} // ou resp.id no bloco correspondente
                        fecharMenu={() => setComentarioMenuAbertoId(null)}
                        setComentario={onChangeComentario}
                        comentario={com.texto} // ou resp.texto
                      />
                    )}
                  </div>
                )}

                <div className="flex gap-3 items-start">
                  <img 
                    src={com.usuario?.foto || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
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

                {/* Ações do Comentário Pai */}
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
                    onClick={() => {
                      setReplyTo({ id: com.id, username: com.usuario?.username || "" });
                      onChangeComentario(`@${com.usuario?.username} `);
                    }}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare size={12} />
                    <span>Responder</span>
                  </button>
                </div>

                {/* RESPOSTAS VINCULADAS (COMENTÁRIO DE COMENTÁRIO) */}
                {respostasDesteComentario.length > 0 && (
                  <div className="pl-6 pt-2 space-y-2 border-l-2 border-slate-200 ml-3">
                    {respostasDesteComentario.map((resp: any) => {
                      const curtidasDestaResposta = resp.curtidas || [];
                      const qtdCurtidasResposta = curtidasDestaResposta.length;

                      const curtidaDoUsuarioResposta = curtidasDestaResposta.find(
                        (c: any) => c.usuarioId === session?.user?.id
                      );
                      
                      const respostaJaCurtida = !!curtidaDoUsuarioResposta;
                      const idDaCurtidaResposta = curtidaDoUsuarioResposta ? curtidaDoUsuarioResposta.id : -1;

                      return (
                        /* COMENTÁRIO DE COMENTÁRIO (relative e pr-8) */
                        <div key={resp.id} className="bg-white p-2.5 pr-8 rounded border border-slate-100 space-y-1.5 relative">
                          
                          {/* Botão 3 Pontinhos do Subcomentário */}
                          {session?.user?.id === resp.usuarioId && (
                            <div className="absolute top-2.5 right-1.5">
                              <button 
                                onClick={() => setComentarioMenuAbertoId(comentarioMenuAbertoId === resp.id ? null : resp.id)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                              >
                                <MoreVertical size={14} />
                              </button>

                              {comentarioMenuAbertoId === resp.id && (
                                <MenuTresPontinhos 
                                  idComentarioSendoEditado={idComentarioSendoEditado}
                                  setIdComentarioSendoEditado={setIdComentarioSendoEditado}
                                  setApagarComentario={setApagarComentario}
                                  idComentario={resp.id} 
                                  fecharMenu={() => setComentarioMenuAbertoId(null)}
                                  setComentario={onChangeComentario}
                                  comentario={resp.texto} 
                                />
                              )}
                            </div>
                          )}

                          <div className="flex gap-2 items-start">
                            <img 
                              src={resp.usuario?.foto || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
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

                          {/* Ações da Sub-resposta */}
                          <div className="flex items-center gap-3 pl-7 text-[10px] font-semibold text-slate-500">
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

                            <button 
                              type="button"
                              onClick={() => {
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
  );
}

type MenuProps = {
  idComentarioSendoEditado: number | null;
  setIdComentarioSendoEditado: (value: number | null) => void;
  setApagarComentario: (value: number) => void;
  idComentario: number;
  fecharMenu: () => void;
  setComentario: (texto: string) => void;
  comentario: string;
}

function MenuTresPontinhos({ 
  idComentarioSendoEditado, 
  setIdComentarioSendoEditado, 
  setApagarComentario, 
  idComentario, 
  fecharMenu, 
  setComentario, 
  comentario 
}: MenuProps) {
  return (
    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-lg min-w-[150px] overflow-hidden z-30 text-slate-700">
      <button 
        onClick={() => {
          if (idComentarioSendoEditado === idComentario) {
            setIdComentarioSendoEditado(null);
            setComentario("");
          } else {
            setIdComentarioSendoEditado(idComentario);
            setComentario(comentario);
          }
          fecharMenu();
        }} 
        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
      >
        {idComentarioSendoEditado === idComentario ? "Cancelar Edição" : "Editar comentário"}
      </button>

      <button
        onClick={() => {
          setApagarComentario(idComentario);
          fecharMenu();
        }}
        className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600 font-medium transition-colors"
      >
        Apagar comentário
      </button>
    </div>
  );
}