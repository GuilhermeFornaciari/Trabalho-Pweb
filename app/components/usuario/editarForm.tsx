'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { UsuarioPerfil } from "@/lib/types/usuarioPerfil";
import { Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import bcrypt from "bcryptjs";

export default function EditarUsuario({
  onRefresh,
  onClose,
  usuario
}: {
  onRefresh: () => void;
  onClose: () => void;
  usuario: UsuarioPerfil | undefined
}) {
  const { data: session, status, update } = useSession();
  const [form, setForm] = useState(usuario);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);

  const [confirmarExclusao1, setConfirmarExclusao1] = useState(false);
  const [confirmarExclusao2, setConfirmarExclusao2] = useState(false);

  useEffect(() => {
    setForm(usuario);
  }, [usuario]);

  const formatarDataParaInput = (dataForm: any) => {
    if (!dataForm) return "";
    const d = new Date(dataForm);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

async function updateUser() {
  if (form === undefined) return;

  const dataNascimentoFormatada = form.dataNascimento 
    ? new Date(form.dataNascimento).toISOString() 
    : null;

  const corpoRequisicao: any = {
    id: form.id,
    nome: form.nome,
    email: form.email,
    foto: form.foto,
    bio: form.bio,
    role: form.role,
    username: form.username,
    dataNascimento: dataNascimentoFormatada,
  };

  if (novaSenha.trim() !== "") {
    corpoRequisicao.senha =  await bcrypt.hash(novaSenha, 10);
  }

  const response = await fetch("../api/usuario/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(corpoRequisicao),
  });

  if (!response.ok) {
    alert("falha em update user");
  } else {
    setNovaSenha("");
    setConfirmarSenha("");
  }
}

  async function handleDeleteUser() {
    if (!form?.id) return;

    try {
      const response = await fetch(`../api/usuario/delete`, {
        method: "DELETE",
        body: JSON.stringify({
          usuarioId: form.id,
        })
      });

      if (response.ok) {
        alert("Sua conta foi excluída permanentemente.");
        signOut({ callbackUrl: "/" });
      } else {
        alert("Erro ao tentar excluir a conta.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro na requisição.");
    }
  }

  const handleSubmit = async () => {
    if (
      !form ||
      form.nome === "" ||
      form.email === "" ||
      form.username === ""
    ) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    if (novaSenha !== "" || confirmarSenha !== "") {
      if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }
    }

    await updateUser();
    await update();
    onClose();
    onRefresh();
  };

  return (
    <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-fadeIn">
      
      {/* Fluxo de Confirmação 1 */}
      {confirmarExclusao1 && (
        <div className="absolute inset-0 bg-white z-20 p-8 flex flex-col justify-center items-center text-center">
          <AlertTriangle size={48} className="text-red-500 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Atenção!</h3>
          <p className="text-sm text-gray-600 mb-6">
            Você está prestes a excluir sua conta. Isso apagará permanentemente seu perfil, resenhas e dados. Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => setConfirmarExclusao1(false)}
              className="flex-1 py-3 rounded-xl border font-medium"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmarExclusao1(false);
                setConfirmarExclusao2(true);
              }}
              className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              Sim, continuar
            </button>
          </div>
        </div>
      )}

      {/* Fluxo de Confirmação 2 */}
      {confirmarExclusao2 && (
        <div className="absolute inset-0 bg-red-50 z-20 p-8 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Tem certeza absoluta?</h3>
          <p className="text-sm text-red-700 mb-6">
            Confirme pela última vez para remover permanentemente o usuário <span className="font-bold">@{form?.username}</span>.
          </p>
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => setConfirmarExclusao2(false)}
              className="flex-1 py-3 rounded-xl bg-white border border-red-200 text-gray-700 font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              className="flex-1 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition-colors shadow-md shadow-red-200"
            >
              EXCLUIR AGORA
            </button>
          </div>
        </div>
      )}

      {/* Formulário Principal */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Editar Perfil</h2>
          <button
            type="button"
            onClick={() => setConfirmarExclusao1(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all"
            title="Excluir conta permanentemente"
          >
            <Trash2 size={14} />
            Excluir Conta
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={form?.foto || "/temp/unkown.jpg"}
              alt="Foto"
              className="rounded-full object-cover w-[150px] h-[150px]"
            />
          </div>
        </div>

        <label className="block text-sm font-medium mb-1 text-slate-700">
          Nome
        </label>
        <input
          type="text"
          value={form?.nome ?? ""}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, nome: e.target.value } : prev
            )
          }
          className="w-full mb-4 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <label className="block text-sm font-medium mb-1 text-slate-700">
          Username
        </label>
        <input
          type="text"
          value={form?.username ?? ""}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, username: e.target.value } : prev
            )
          }
          className="w-full mb-4 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

         <label className="block text-sm font-medium mb-1 text-slate-700">
          Foto
        </label>
        <input
          type="text"
          value={form?.foto ?? ""}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, foto: e.target.value } : prev
            )
          }
          className="w-full mb-4 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <label className="block text-sm font-medium mb-1 text-slate-700">
          Data de Nascimento
        </label>
        <input
          type="date"
          value={formatarDataParaInput(form?.dataNascimento)}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, dataNascimento: e.target.value ? new Date(e.target.value) : null } : prev
            )
          }
          className="w-full mb-4 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700 cursor-pointer"
        />

        <label className="block text-sm font-medium mb-1 text-slate-700">
          Bio
        </label>
        <input
          type="text"
          value={form?.bio ?? ""}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, bio: e.target.value } : prev
            )
          }
          className="w-full mb-4 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <label className="block text-sm font-medium mb-1 text-slate-700">
          Email
        </label>
        <input
          type="email"
          value={form?.email ?? ""}
          onChange={(e) =>
            setForm((prev) =>
              prev ? { ...prev, email: e.target.value } : prev
            )
          }
          className="w-full mb-6 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <hr className="my-6 border-slate-100" />
        <h3 className="text-sm font-bold text-slate-800 mb-3">Alterar Senha</h3>

        {/* CAMPO: Nova Senha */}
        <label className="block text-sm font-medium mb-1 text-slate-700">
          Nova Senha
        </label>
        <div className="relative mb-4">
          <input
            type={verSenha ? "text" : "password"}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Deixe em branco para não alterar"
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200 pr-11"
          />
          <button
            type="button"
            onClick={() => setVerSenha(!verSenha)}
            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
          >
            {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* CAMPO: Confirmar Senha */}
        <label className="block text-sm font-medium mb-1 text-slate-700">
          Confirmar Nova Senha
        </label>
        <input
          type={verSenha ? "text" : "password"}
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          placeholder="Repita a nova senha"
          className="w-full mb-6 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200"
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border font-medium hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-[#F7D774] font-semibold hover:bg-[#ebd06a] transition-colors"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}