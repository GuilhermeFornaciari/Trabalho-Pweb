import { CornerDownRight, Send, X, Check, Pencil } from "lucide-react";

type Props = {
  comentario: string;
  postId: number;
  onChangeComentario: (texto: string) => void;
  onSubmitComentario: (idPost: number, comentarioId?: number) => void;
  replyTo: { id: number; username: string } | null;
  setReplyTo: (value: { id: number; username: string } | null) => void;
  isEditing?: boolean; 
  onCancelarEdicao?: () => void;
};

export default function ComentarioInput({
  comentario,
  onSubmitComentario,
  onChangeComentario,
  postId,
  replyTo,
  setReplyTo,
  isEditing = false,
  onCancelarEdicao
}: Props) {

  return (
    <div className="p-4 border-t border-slate-100 bg-white space-y-2">
      
      {/* Indicador de Resposta */}
      {replyTo && !isEditing && (
        <div className="flex justify-between items-center bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-md font-medium">
          <span className="flex items-center gap-1">
            <CornerDownRight size={14} /> Respondendo a @{replyTo.username}
          </span>
          <button 
            type="button"
            className="text-blue-500 hover:text-blue-700" 
            onClick={() => {
              setReplyTo(null);
              if (comentario.startsWith(`@${replyTo.username}`)) {
                onChangeComentario("");
              }
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* NOVO: Indicador Visual de Edição */}
      {isEditing && (
        <div className="flex justify-between items-center bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-md font-medium border border-amber-100">
          <span className="flex items-center gap-1">
            <Pencil size={14} /> Editando o seu comentário
          </span>
          <button 
            type="button"
            className="text-amber-500 hover:text-amber-700" 
            onClick={() => {
              onChangeComentario(""); // Limpa o input
              if (onCancelarEdicao) onCancelarEdicao();
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form 
        onSubmit={(e) => {
          e.preventDefault();
          
          if (isEditing) {
            onSubmitComentario(postId); 
          } else {
            const paiId = replyTo ? replyTo.id : undefined;
            onSubmitComentario(postId, paiId);
            setReplyTo(null);
          }
        }}
        className="flex gap-2 items-center"
      >
        <input 
          type="text"
          value={comentario}
          onChange={(e) => onChangeComentario(e.target.value)}
          placeholder={
            isEditing 
              ? "Altere o seu comentário..." 
              : replyTo ? `Sua resposta para @${replyTo.username}...` : "Escreva seu comentário..."
          }
          className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${
            isEditing 
              ? "border-amber-200 focus:border-amber-500 bg-amber-50/20" 
              : "border-slate-200 focus:border-blue-500"
          }`}
          required
        />

        {/* ÍCONE DINÂMICO: Muda com base no estado 'isEditing' */}
        {isEditing ? (
          <button 
            type="submit" 
            title="Salvar alterações"
            className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Check size={16} />
          </button>
        ) : (
          <button 
            type="submit" 
            title="Enviar comentário"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Send size={16} />
          </button>
        )}
      </form>
    </div>
  );
}