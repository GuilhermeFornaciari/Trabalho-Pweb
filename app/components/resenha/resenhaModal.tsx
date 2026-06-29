import Link from "next/link";
import { Star, Heart, X, MessageSquare, CornerDownRight, Send } from "lucide-react";
import { Postagem } from "@/lib/prisma/generated/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ComentarioInput from "../comentario/comentarioInput";
import ComentarioList from "../comentario/comentarioList";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  curtidas: any[];
  comentarios?: any[]; // Incluído para listar os comentários se já vierem no objeto
};


type Props = {
  resenha: ResenhaDetalhes;
  comentario: string;
  onChangeComentario: (texto: string) => void;
  onSubmitComentario: (idPost: number, parentId?: number) => void;
  onClose: () => void;
  curtir: (postagemId: number, curtido: boolean, curtidaId: number) => void;
  onCurtirComentario: (comentarioId: number, curtido: boolean, curtidaId: number) => void;
  idComentarioSendoEditado: number | null;
  setIdComentarioSendoEditado: (id: number | null) => void;
  setApagarComentario: (id: number) => void;

};

export default function ResenhaModal({
  resenha,
  comentario,
  onChangeComentario,
  onSubmitComentario,
  onClose,
  curtir,
  onCurtirComentario,
  idComentarioSendoEditado,
  setIdComentarioSendoEditado,
  setApagarComentario
}: Props) {
  const { data: session } = useSession();
  
  const [curtido, setCurtido] = useState(false);
  const [curtidaId, setCurtidaId] = useState(-1);
  const [qtdCurtidas, setQtdCurtidas] = useState(resenha.curtidas.length);
  
  useEffect(() => {
    if (!session?.user?.id) return;

    const curtidaDoUsuario = resenha.curtidas.find(
      (curtida: { usuarioId: string; id: number }) => curtida.usuarioId === session.user.id
    );

    setCurtido(!!curtidaDoUsuario);
    setCurtidaId(curtidaDoUsuario?.id ?? -1);
    setQtdCurtidas(resenha.curtidas.length);
  }, [session, resenha]);

  const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);

  // Efeito colateral para repassar a exclusão para o componente pai se necessário
  // (Caso queira controlar o setApagarComentario do pai direto, pode passar por prop também)

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

        {/* Corpo */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-slate-800">{resenha.titulo}</h2>
            <div className="flex -translate-y-0.5">
              {[1, 2, 3, 4, 5].map((valor) => (
                <Star
                  key={valor}
                  size={16}
                  className={valor <= (resenha.nota ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                />
              ))}
            </div>
          </div>

          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-serif bg-slate-50 p-4 rounded-xl border border-slate-100">
            {resenha.texto}
          </p>

          <div className="pt-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQtdCurtidas((q) => curtido ? q - 1 : q + 1); 
                setCurtido(c => !c);
                curtir(resenha.id, curtido, curtidaId);
              }} 
              className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
            >
              <Heart size={15} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
              <span>{qtdCurtidas}</span>
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Seção de Comentários */}
          <ComentarioList
            resenha={resenha}
            onChangeComentario={onChangeComentario}
            onCurtirComentario={onCurtirComentario}
            setReplyTo={setReplyTo}
            idComentarioSendoEditado={idComentarioSendoEditado}
            setIdComentarioSendoEditado={setIdComentarioSendoEditado}
            setApagarComentario={setApagarComentario}
          />

        </div>

        {/* Input Fixo */}
        <ComentarioInput 
          comentario={comentario} // Usa o texto vindo do Pai
          postId={resenha.id}
          onChangeComentario={onChangeComentario}
          onSubmitComentario={onSubmitComentario}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          isEditing={idComentarioSendoEditado !== null} 
          onCancelarEdicao={() => {
            setIdComentarioSendoEditado(null);
            onChangeComentario("");
          }}
        />

      </div>
    </div>
  );
}