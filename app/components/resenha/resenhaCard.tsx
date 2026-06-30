import { Postagem } from "@/lib/prisma/generated/client";
import { Star, Heart, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  comentarios: any[];
  curtidas: any[];
};

type Props = {
  resenha: ResenhaDetalhes;
  onClick: (resenha: ResenhaDetalhes) => void;
  curtir: (postagemId: number, curtido: boolean, curtidaId: number) => void;
};

export default function ResenhaCard({ resenha, onClick, curtir }: Props) {
      const { data: session } = useSession();
  
      const [curtido, setCurtido] = useState(false);
      const [curtidaId, setCurtidaId] = useState(-1);
      const [qtdCurtidas, setQtdCurtidas] = useState(resenha.curtidas.length);

      const [revelarSpoiler, setRevelarSpoiler] = useState(false);
  
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

      
  return (
    <div
      onClick={() => onClick(resenha)}
      className="w-full max-w-4xl my-4 p-5 mx-auto bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-slate-400">@{resenha.usuario.username}</span>
        <span className="text-xs text-slate-400">
          {new Date(resenha.data).toLocaleDateString('pt-BR')}
        </span>
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <h3 className="text-base font-bold text-slate-800">{resenha.titulo}</h3>
        <div className="flex -translate-y-0.5">
          {[1, 2, 3, 4, 5].map((valor) => (
            <Star
              key={valor}
              size={14}
              className={
                valor <= (resenha.nota ?? 0)
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-200"
              }
            />
          ))}
        </div>
      </div>
      <div 

        className="relative mb-4 group"
        onClick={(e) => {
          if (resenha.temSpoiler && !revelarSpoiler) {
            e.stopPropagation(); 
            setRevelarSpoiler(true);
          }
        }}
      >
        <p className={`text-sm text-slate-600 line-clamp-2 transition-all duration-300 ${
          resenha.temSpoiler && !revelarSpoiler 
            ? "blur-sm select-none bg-slate-50/50 p-1 rounded cursor-eye-off" 
            : ""
        }`}>
          {resenha.texto}
        </p>
        
        {resenha.temSpoiler && !revelarSpoiler && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-700 tracking-wider uppercase bg-white/20 backdrop-blur-[1px] rounded">
            Contém spoiler!
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <button onClick={(e) => {e.stopPropagation();
            setCurtido(cur => !cur);
            setQtdCurtidas((q:number) => curtido ? q - 1 : q + 1); 
           curtir(resenha.id, curtido, curtidaId);}} className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
          <Heart size={15} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
          <span>{qtdCurtidas} Curtidas</span>
        </button>

        <div className="flex items-center gap-1.5">
          <MessageSquare size={15} />
          <span>{resenha.comentarios?.length || 0} Comentários</span>
        </div>
      </div>
    </div>
  );
}