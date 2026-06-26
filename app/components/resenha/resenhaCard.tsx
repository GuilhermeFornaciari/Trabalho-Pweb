import { Postagem } from "@/lib/prisma/generated/client";
import { Star, Heart } from "lucide-react";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  curtidas: any[];
};

type Props = {
  resenha: ResenhaDetalhes;
  onClick: (resenha: ResenhaDetalhes) => void;
};

export default function ResenhaCard({ resenha, onClick }: Props) {
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
        <Heart size={14} className="text-slate-400" />
        <span>{resenha.curtidas?.length || 0} curtidas</span>
      </div>
    </div>
  );
}