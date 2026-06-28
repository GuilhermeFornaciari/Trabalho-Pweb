import { CornerDownRight, Send, X } from "lucide-react";

type Props = {
  comentario: string;
  postId: number;
  onChangeComentario: (texto: string) => void;
  onSubmitComentario: (idPost: number, comentarioId?: number) => void;
  replyTo: {id: number, username: string} | null;
  setReplyTo: (value: { id: number; username: string } | null) => void;
};


export default function ComentarioInput({comentario, onSubmitComentario, onChangeComentario, postId, replyTo, setReplyTo}: Props){

    return(
         <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          {replyTo && (
            <div className="flex justify-between items-center bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-md font-medium">
              <span className="flex items-center gap-1">
                <CornerDownRight size={14} /> Respondendo a @{replyTo.username}
              </span>
              <button className="text-blue-500 hover:text-blue-700" 
                  onClick={() => {setReplyTo(null);
                   if (comentario.startsWith(`@${replyTo.username}`)) {
                      onChangeComentario("");
                    }} }>

                <X size={14} />
              </button>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const paiId = replyTo ? replyTo.id : undefined;
              onSubmitComentario(postId, paiId);
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
    );
}