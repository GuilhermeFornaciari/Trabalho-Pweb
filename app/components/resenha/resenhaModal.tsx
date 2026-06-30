'use client'

import Link from "next/link";
import { Star, Heart, X, MoreVertical } from "lucide-react";
import { Postagem } from "@/lib/prisma/generated/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ComentarioInput from "../comentario/comentarioInput";
import ComentarioList from "../comentario/comentarioList";
import MenuAcoes from "../modalAcoes";
import ResenhaEditeCreateModal from "./resenhaEditCreate";

type ResenhaDetalhes = Postagem & {
  usuario: { id: number; nome: string; username: string; foto: string | null };
  curtidas: any[];
  comentarios?: any[];
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
  // onDeleteResenha?: (idResenha: number) => void;
  onUpdateResenha?: () => void; 
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
  setApagarComentario,
  // onDeleteResenha,
  onUpdateResenha
}: Props) {
  const { data: session } = useSession();
  
  const [curtido, setCurtido] = useState(false);
  const [curtidaId, setCurtidaId] = useState(-1);
  const [qtdCurtidas, setQtdCurtidas] = useState(resenha.curtidas.length);
  const [modalAcoes, setModalAcoes] = useState(false);

  // Estados locais para controlar o formulário de edição
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [editTitulo, setEditTitulo] = useState("");
  const [editTexto, setEditTexto] = useState("");
  const [editNota, setEditNota] = useState(0);
  const [editSpoiler, setEditSpoiler] = useState(false);

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

  const handleAbrirEdicao = () => {
    setEditTitulo(resenha.titulo || "");
    setEditTexto(resenha.texto || "");
    setEditNota(resenha.nota || 0);
    setEditSpoiler(resenha.temSpoiler || false);
    setModalAcoes(false); 
    setMostrarModalEditar(true);
  };

  const handleSaveEdicao = async () => {
    try {
      const response = await fetch("/api/resenha/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resenha.id,
          livroId: resenha.livroId,
          usuarioId: session?.user?.id,
          titulo: editTitulo,
          texto: editTexto,
          nota: editNota,
          spoiler: editSpoiler,
        }),
      });

      if (!response.ok) {
        const erro = await response.json();
        alert(JSON.stringify(erro, null, 2));
        return;
      }

      alert("Resenha atualizada!");
      setMostrarModalEditar(false);
      if (onUpdateResenha) onUpdateResenha();
      onClose(); 
    } catch (e) {
      console.error(e);
      alert("Erro ao editar resenha.");
    }
  };

  const handleDeletarResenha = async () => {
    if (!confirm("Tem certeza que deseja apagar esta resenha?")) return;

    try {
      const resultado = await fetch(`/api/post/delete`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        postId: resenha.id
      })
      });
      if (!resultado.ok) {
        alert("Erro ao apagar resenha");
        return;
      }

      alert("Resenha removida com sucesso!");
      if (onUpdateResenha) onUpdateResenha();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn relative">
          
          {/* Topo do Modal */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <Link 
              href={"/perfil/" + resenha.usuario.username} 
              className="text-xs font-semibold text-slate-500 hover:underline"
            >
              @{resenha.usuario.username}
            </Link>
            
            <div className="flex items-center gap-2">
              {/* Menu de ações visível apenas se o usuário logado for o dono da postagem */}
              {session?.user?.id === resenha.usuarioId.toString() && (
                <div className="relative">
                  <button 
                    onClick={() => setModalAcoes(!modalAcoes)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {modalAcoes && (
                    <MenuAcoes 
                      style="absolute right-0 top-7 z-30 min-w-[150px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
                      onEditar={handleAbrirEdicao}
                      onApagar={handleDeletarResenha}
                      onClose={() => setModalAcoes(false)}
                    />
                  )}
                </div>
              )}

              <button
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Corpo */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="flex items-center gap-6">
              <h2 className="text-xl font-bold text-slate-800 break-words text-wrap">{resenha.titulo}</h2>
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

            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-serif bg-slate-50 p-4 rounded-xl border border-slate-100 break-words text-wrap">
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
                className="flex items-center gap-1.5 hover:text-red-500 transition-colors text-sm font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full w-fit border border-slate-100"
              >
                <Heart size={15} className={curtido ? "fill-red-500 text-red-500" : "text-slate-500"}/>
                <span>{qtdCurtidas} Curtidas</span>
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
            comentario={comentario}
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

      {/* Modal Modular de Edição */}
      <ResenhaEditeCreateModal
        isOpen={mostrarModalEditar}
        onClose={() => setMostrarModalEditar(false)}
        titulo={editTitulo}
        setTitulo={setEditTitulo}
        resenha={editTexto}
        setResenha={setEditTexto}
        nota={editNota}
        setNota={setEditNota}
        spoiler={editSpoiler}
        setSpoiler={setEditSpoiler}
        onSubmit={handleSaveEdicao}
      />
    </>
  );
}