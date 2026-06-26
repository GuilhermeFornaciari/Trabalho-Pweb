'use client'

import { X, Heart, MessageSquare, Send } from "lucide-react";

type Props = {
  post: any;
  comentarioTexto: string;
  onChangeComentario: (text: string) => void;
  onSubmitComentario: (postId: number) => void;
  onClose: () => void;
};

export default function FeedDetailsModal({
  post,
  comentarioTexto,
  onChangeComentario,
  onSubmitComentario,
  onClose
}: Props) {
  if (!post) return null;
  const isProgresso = post.paginaAtual !== null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
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

          {/* Botão Curtir Placeholder */}
          <div className="pt-2 flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors bg-slate-100 px-4 py-2 rounded-full">
              <Heart size={16} /> Curtir ({post.curtidas?.length || 0})
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Seção de Comentários */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <MessageSquare size={16} /> Comentários ({post.comentarios?.length || 0})
            </h4>
            
            {/* Lista de Comentários salvos vindo do Include */}
            <div className="space-y-4 mb-6">
              {post.comentarios && post.comentarios.length > 0 ? (
                post.comentarios.map((com: any) => (
                  <div key={com.id} className="flex gap-3 items-start bg-slate-50/60 p-3 rounded-lg border border-slate-100">
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
                ))
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-4">Nenhum comentário ainda. Seja o primeiro!</p>
              )}
            </div>
          </div>
        </div>

        {/* Input Fixo de Criar Comentário */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitComentario(post.id);
            }}
            className="flex gap-2 items-center"
          >
            <input 
              type="text"
              value={comentarioTexto}
              onChange={(e) => onChangeComentario(e.target.value)}
              placeholder="Escreva sua resposta..."
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}