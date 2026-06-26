import Link from "next/link";
import { Star, Heart, X } from "lucide-react";
import { Postagem } from "@/lib/prisma/generated/client";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  curtidas: any[];
  comentarios?: any[]; // Incluído para listar os comentários se já vierem no objeto
};

type Props = {
  resenha: ResenhaDetalhes;
  comentario: string;
  onChangeComentario: (texto: string) => void;
  onSubmitComentario: (idResenha: number) => void;
  onClose: () => void;
};

export default function ResenhaModal({
  resenha,
  comentario,
  onChangeComentario,
  onSubmitComentario,
  onClose,
}: Props) {
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
          <div className="flex items-center gap-2.5">
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

          <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-sans">
            {resenha.texto}
          </p>

          <div className="pt-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-500 transition-colors bg-slate-100 px-3 py-1.5 rounded-full">
              <Heart size={14} /> Curtir ({resenha.curtidas?.length || 0})
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Área de Comentários / Inputs */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
              Deixe um comentário
            </label>
            <textarea
              value={comentario}
              onChange={(e) => onChangeComentario(e.target.value)}
              placeholder="O que você achou dessa resenha?"
              rows={3}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <div className="flex justify-end">
              <button
                onClick={() => onSubmitComentario(resenha.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Comentar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}