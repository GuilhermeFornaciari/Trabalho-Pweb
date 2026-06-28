import { Postagem } from "@/lib/prisma/generated/client";
import { Heart, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

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
};

export default function ComentarioList({ resenha, onCurtirComentario, onChangeComentario, setReplyTo }: Props) {
  const { data: session } = useSession();

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
                      // Define o ID do comentário pai e preenche o @ do autor
                      setReplyTo({ id: com.id, username: com.usuario?.username || "" });
                      onChangeComentario(`@${com.usuario?.username} `);
                    }}
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
                      
                      const curtidasDestaResposta = resp.curtidas || [];
                      const qtdCurtidasResposta = curtidasDestaResposta.length;

                      const curtidaDoUsuarioResposta = curtidasDestaResposta.find(
                        (c: any) => c.usuarioId === session?.user?.id
                      );
                      
                      const respostaJaCurtida = !!curtidaDoUsuarioResposta;
                      const idDaCurtidaResposta = curtidaDoUsuarioResposta ? curtidaDoUsuarioResposta.id : -1;

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
                                // Vincula ao ID pai principal (com.id) para agrupar na árvore certa do Prisma, 
                                // mas exibe visualmente o username de quem enviou esta sub-resposta (resp.usuario)
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