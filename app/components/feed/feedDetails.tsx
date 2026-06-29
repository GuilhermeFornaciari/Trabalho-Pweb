'use client'

import { X, Heart, Star, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ComentarioList from "../comentario/comentarioList";
import ComentarioInput from "../comentario/comentarioInput";
import Modal from "../modal";
import MenuAcoes from "../modalAcoes";
// Importe o modal que modularizamos
import ResenhaEditeCreateModal from "../resenha/resenhaEditCreate"; 
import ProgressoForm from "../progresso/progressoForm";
import { Postagem } from "@/lib/prisma/generated/client";

type Props = {
  post: any;
  comentarioTexto: string;
  onChangeComentario: (text: string) => void;
  onSubmitComentario: (postId: number, comentarioId?: number) => void;
  onClose: () => void;
  onCurtir: (postagemId: number, curtido: boolean, curtidaId: number) => void;
  onCurtirComentario: (comentarioId: number, curtido: boolean, curtidaId: number) => void;
  idComentarioSendoEditado: number | null;
  setIdComentarioSendoEditado: (id: number | null) => void;
  setApagarComentario: (id: number) => void;
  onDelete: (postId: number) => void;
  onUpdatePost?: () => void; // Callback opcional para atualizar a listagem após editar
  onEdit: (post: any | null) => void;
};

export default function FeedDetails({
  post,
  comentarioTexto,
  onChangeComentario,
  onSubmitComentario,
  onClose,
  onCurtir,
  onCurtirComentario,
  idComentarioSendoEditado,
  setIdComentarioSendoEditado,
  setApagarComentario,
  onDelete,
  onUpdatePost,
  onEdit
}: Props) {
  if (!post) return null;
  const isProgresso = post.paginaAtual !== null;
  const { data: session } = useSession();
  const [curtido, setCurtido] = useState(false);
  const [curtidaId, setCurtidaId] = useState(-1);
  const [qtdCurtidas, setQtdCurtidas] = useState(0);
  const [modalAcoes, setModalAcoes] = useState(false);
  const [postagemEmEdicao, setPostagemEmEdicao] = useState<Postagem | null>(null);

  const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);

  // --- ESTADOS PARA O MODAL DE EDIÇÃO ---
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [editTitulo, setEditTitulo] = useState("");
  const [editResenha, setEditResenha] = useState("");
  const [editNota, setEditNota] = useState(0);
  const [editSpoiler, setEditSpoiler] = useState(false);

  useEffect(() => {
    if (!post.curtidas) return;

    const curtidasDoPost = post.curtidas.filter((c: any) => c.comentarioId === null || c.comentarioId === undefined);
    setQtdCurtidas(curtidasDoPost.length);

    if (session?.user?.id) {
      const curtidaDoUsuario = curtidasDoPost.find((c: any) => c.usuarioId === session.user.id);
      setCurtido(!!curtidaDoUsuario);
      setCurtidaId(curtidaDoUsuario?.id ?? -1);
    }
  }, [session, post]);

  // Função que popula os dados do formulário e abre o modal de edição
  const handleAbrirEdicao = () => {
    setEditTitulo(post.titulo || "");
    setEditResenha(post.texto || "");
    setEditNota(post.nota || 0);
    setEditSpoiler(post.spoiler || false);
    setModalAcoes(false); // Fecha o menu de bolinhas
    setMostrarModalEditar(true); // Abre o modal de edição
  };

  // Função de submit da edição (chama a sua API de Update via Upsert ou rota específica)
  const handleSuvmitEdicao = async () => {
    try {
      const response = await fetch("/api/resenha/upsert", { // ou a sua rota correspondente de update/create
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id, 
          livroId: post.livroId,
          usuarioId: session?.user?.id,
          titulo: editTitulo,
          texto: editResenha,
          nota: editNota,
          spoiler: editSpoiler,
        }),
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(JSON.stringify(erro, null, 2));
        return;
      }

      alert("Publicação atualizada com sucesso!");
      setMostrarModalEditar(false);
      
      if (onUpdatePost) {
        onUpdatePost(); // Atualiza os dados na tela principal se a prop existir
      }
      onClose(); // Fecha o modal de detalhes atual
    } catch (error) {
      console.error("Erro ao editar postagem:", error);
      alert("Erro ao salvar alterações.");
    }
  };

  return (
    <Modal open={!!post} onClose={onClose}>
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

        {postagemEmEdicao && (
          <Modal open={postagemEmEdicao !== null} onClose={() => setPostagemEmEdicao(null)}>
            <ProgressoForm 
              livro={post.livro} 
              progresso={postagemEmEdicao} 
              edit={true} 
              onClose={() => setPostagemEmEdicao(null)} 
              onSave={(post) => {
                onEdit(post)
                onClose()
              }}
            />
          </Modal>
        )}

          <div className="relative flex-1 overflow-y-auto p-6 space-y-6">
            {(session?.user.id === post.usuarioId) && (
              <>
                <div className="absolute top-3 right-2">
                  <button 
                    onClick={() => setModalAcoes(!modalAcoes)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
                {modalAcoes && <MenuAcoes 
                  style="absolute right-5 top-10 z-30 min-w-[170px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
                  onEditar={handleAbrirEdicao} // Atribuído a função de preenchimento
                  onApagar={async () => {
                    await onDelete(post.id);
                    onClose();
                  }}
                  onClose={() => setModalAcoes(false)}
                />}
              </>
            )}
            
            {/* Post Principal */}
            <div>
              <div className="flex gap-4 items-start mb-4">
                <img src={post.livro.capa} alt="" className="w-20 h-30 rounded shadow-md object-cover flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{post.livro.titulo}</h2>
                  <p className="text-xs text-slate-500 mb-2">{post.livro.autores.map((e: any) => e.autor.nome).join(",")}</p>
                  {isProgresso ? (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                      Progresso: Página {post.paginaAtual} de {post.livro.paginas}
                    </span>
                  ) : (
                    <div className="flex -translate-y-0.5">
                      {[1, 2, 3, 4, 5].map((valor) => (
                        <Star
                          key={valor}
                          size={14}
                          className={
                            valor <= (post.nota ?? 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {!isProgresso && <h3 className="text-lg font-bold text-slate-800 mb-2 break-words text-wrap">{post.titulo}</h3>}
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-serif bg-slate-50 p-4 rounded-xl border border-slate-100 break-words text-wrap">
                {post.texto}
              </p>
            </div>

            {/* Botão Curtir Post */}
            <div className="pt-2 flex items-center gap-4">
              <button onClick={(e) => { 
                e.stopPropagation();
                setCurtido(c => !c);                          
                setQtdCurtidas((q) => curtido ? q - 1 : q + 1); 
                onCurtir(post.id, curtido, curtidaId);
              }}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 transition-colors bg-slate-100 px-4 py-2 rounded-full">
                <Heart size={16} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
                <span>{qtdCurtidas} Curtidas</span>
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Seção de Comentários */}
            <ComentarioList 
              onChangeComentario={onChangeComentario}
              onCurtirComentario={onCurtirComentario}
              resenha={post}
              setReplyTo={setReplyTo}
              idComentarioSendoEditado={idComentarioSendoEditado}
              setIdComentarioSendoEditado={setIdComentarioSendoEditado}
              setApagarComentario={setApagarComentario}
            />
          </div>

          {/* Input Fixo de Criar Comentário / Resposta */}
          <ComentarioInput
            comentario={comentarioTexto}
            onChangeComentario={onChangeComentario}
            onSubmitComentario={onSubmitComentario}
            replyTo={replyTo}
            postId={post.id}
            setReplyTo={setReplyTo}
            isEditing={idComentarioSendoEditado !== null} 
            onCancelarEdicao={() => {
              setIdComentarioSendoEditado(null);
              onChangeComentario("");
            }}
          />
        </div>

      {/* --- RENDERIZAÇÃO DO MODAL DE EDIÇÃO --- */}
      <ResenhaEditeCreateModal
        isOpen={mostrarModalEditar}
        onClose={() => setMostrarModalEditar(false)}
        titulo={editTitulo}
        setTitulo={setEditTitulo}
        resenha={editResenha}
        setResenha={setEditResenha}
        nota={editNota}
        setNota={setEditNota}
        spoiler={editSpoiler}
        setSpoiler={setEditSpoiler}
        onSubmit={handleSuvmitEdicao}
        />
        </Modal>

  );
}