import { Postagem } from "@/lib/prisma/generated/client";
import { Star, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  curtidas: any[];
};

type Props = {
  resenha: ResenhaDetalhes;
  onClick: (resenha: ResenhaDetalhes) => void;
};

export default function ResenhaCard({ resenha, onClick }: Props) {
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
  
      async function curtir(postagemId: number) {
        if (!session?.user.id) return;
  
        if (curtido) {
          const response = await fetch("../api/curtida/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              curtidaId,
            }),
          });
  
          if (!response.ok) return;
  
          setCurtido(false);
          setQtdCurtidas((q:number) => q - 1);
  
        } else {
          const response = await fetch("../api/curtida/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuarioId: session.user.id,
              postagemId,
              comentarioId: undefined,
            }),
          });
  
          if (!response.ok) return;
  
          const data = await response.json();
  
          setCurtido(true);
          setCurtidaId(data.id); // <- assumindo que curtirPostComent retorna a curtida criada
          setQtdCurtidas((q: number) => q + 1);
        }
      }

      
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

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{resenha.texto}</p>

      <div className="flex items-center gap-1 text-xs text-slate-400">
        <button onClick={(e) => {e.stopPropagation(); curtir(resenha.id);}} className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
          <Heart size={15} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
          <span>{qtdCurtidas} Curtidas</span>
        </button>
      </div>
    </div>
  );
}