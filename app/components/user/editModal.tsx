'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

type EditModalProps = {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
};

export default function EditModal({
  open,
  onClose,
  onRefresh
}: EditModalProps) {
  //const [mostrarSenha, setMostrarSenha] = useState(false);

  const { data: session, status, update } = useSession();
  const [usuario, setUsuario] = useState(session?.user);

  useEffect(() => {
    if (status === "authenticated") {
      setUsuario(session.user);
    }
  }, [session, status]);

  async function updateUser() {
    const response = await fetch("../api/usuario/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
        alert("falha em update user");
    }
  }

  const handleSubmit = async () => {
    if (
      !usuario ||
      usuario.nome === "" ||
      usuario.email === "" ||
      usuario.username === ""
    ) {
      alert("Preencha os campos");
      return;
    }

    await updateUser();
    await update();
    onClose();
    onRefresh();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="p-8"
        >
          <h2 className="text-xl font-bold mb-6">
            Editar Perfil
          </h2>

          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src={usuario?.foto || "/temp/caju.jpeg"}
                alt="Foto"
                fill
                className="rounded-full object-cover"
              />
            </div>

            <button
              type="button"
              className="mt-3 text-sm text-blue-600"
            >
              Alterar Foto
            </button>
          </div>

          <label className="block text-sm font-medium mb-1">
            Nome
          </label>
          <input
            type="text"
            value={usuario?.nome ?? ""}
            onChange={(e) =>
              setUsuario((prev) =>
                prev ? { ...prev, nome: e.target.value } : prev
            )}
            className="w-full mb-4 px-4 py-3 rounded-xl border"
          />

          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            value={usuario?.username ?? ""}
            onChange={(e) =>
              setUsuario((prev) => 
                prev ? { ...prev, username: e.target.value } : prev
            )}
            className="w-full mb-4 px-4 py-3 rounded-xl border"
          />

          <label className="block text-sm font-medium mb-1">
            Bio
          </label>
          <input
            type="text"
            value={usuario?.bio ?? ""}
            onChange={(e) =>
              setUsuario((prev) =>
                prev ? { ...prev, bio: e.target.value } : prev    
            )}
            className="w-full mb-4 px-4 py-3 rounded-xl border"
          />

          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={usuario?.email ?? ""}
            onChange={(e) => 
              setUsuario((prev) =>
                prev ? { ...prev, email: e.target.value } : prev
            )}
            className="w-full mb-4 px-4 py-3 rounded-xl border"
          />

          {/* <label className="block text-sm font-medium mb-1">
            Senha
          </label>

          <div className="relative mb-6">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={usuario?.senha ?? ""}
              onChange={(e) =>
                onChange(
                  usuario
                    ? { ...usuario, senha: e.target.value }
                    : undefined
                )
              }
              className="w-full px-4 py-3 rounded-xl border pr-20"
            />

            <button
              type="button"
              onClick={() =>
                setMostrarSenha((prev) => !prev)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            >
              {mostrarSenha ? "Ocultar" : "Mostrar"}
            </button>
          </div> */}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#F7D774]"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}