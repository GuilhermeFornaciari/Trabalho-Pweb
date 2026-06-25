'use client'

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/lib/prisma/generated/client";
import { useSession } from "next-auth/react";


export default function PerfilPage({params,}: {params: Promise<{ id: string }>}) {
    const {id} = use(params);
    const { data: session, status } = useSession();

    const backgroundImage = "/images/fundo-perfil.jpg";

    const [modalAberto, setModalAberto] = useState(false);

    const [mostrarSenha, setMostrarSenha] = useState(false);
    
    const [usuario, setUsuario] = useState<User>();

  //   const mockUser: User = {
  //   id: "1",
  //   nome: "Hugo Souza",
  //   email: "hugo.souza@email.com",
  //   emailVerified: new Date("2026-01-15"),
  //   foto: "/temp/caju.jpeg",
  //   bio: "Leitor ávido | Explorando um livro por semana | procuro romance",
  //   role: "USER",
  //   senha: "$2a$10$abcdefghijklmnopqrstuv",
  //   username: "hugosouza",
  //   dataNascimento: new Date("2003-08-20"),
  // };

    useEffect(() => {
      const carregarUsuario = async () => {

        const response = await fetch(`../api/usuario/${id}`);

        if(response.ok){
          const data = await response.json();
          setUsuario(data);
        }

      };

      carregarUsuario();
    }, []);

    useEffect(() => {
      if (modalAberto) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return () => {
        document.body.style.overflow = ""; 
      };
    }, [modalAberto]);


  async function updateUser() {
    const response = await fetch("../api/usuario/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });


    return {
      ok: response.ok,
    }
  }

  const handleSubmit = async () => {
    if(usuario?.email === "" || usuario?.senha === "" || usuario?.nome == ""){
      alert("Preencha os campos")
      return
    }
    const resultado = await updateUser();

    if (!resultado.ok) {
        alert("falha em update user");
    }
  }


  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage }}/>

        <div className="fixed inset-0 -z-10 bg-[#FFF8EB]/80" />

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Cabeçalho do perfil */}
        <div className="flex items-center gap-10 pb-8 border-b border-[#E8D89A]">

          {/* Foto */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src={usuario?.foto || "/temp/caju.jpeg"}
              alt="Foto do usuário"
              fill
              className="rounded-full object-cover border-4 border-[#F7D774]"
            />
          </div>

          {/* Infos */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-[#4F442E]">
                {usuario?.username}
              </h1>
              <button
                onClick={() => setModalAberto(true)}
                className="px-4 py-1.5 rounded-lg bg-[#F7D774] hover:bg-[#F2CF5A] transition text-sm font-semibold text-[#4F442E]"
              >
                Editar perfil
              </button>
            </div>

           <div className="flex items-center gap-3">
              <p className="text-[#4F442E] font-medium">{usuario?.nome}</p>
              {usuario?.dataNascimento && (
                <span className="text-[#8A7A5B] text-sm">
                  {new Date().getFullYear() - new Date(usuario.dataNascimento).getFullYear()} anos
                </span>
              )}
            </div>

            <p className="text-[#8A7A5B] text-sm max-w-xs"> {usuario?.bio} </p>


          </div>
        </div>

        {/* Área futura — postagens, biblioteca, etc. */}
        <div className="mt-10 text-center text-[#8A7A5B] text-sm">
          {/* conteúdo futuro aqui */}
        </div>

      </div>


      {modalAberto && (
       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
              setModalAberto(false);
            }}
            className="p-8"
          >
            <h2 className="text-xl font-bold mb-6">
              Editar Perfil
            </h2>

            {/* Foto */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24">
                <Image
                  src={usuario?.foto || "/temp/caju.png"}
                  alt="Foto"
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <button type="button" className="mt-3 text-sm text-blue-600">
                Alterar Foto
              </button>
            </div>

            {/* Nome */}
            <label className="block text-sm font-medium mb-1">
              Nome
            </label>
            <input
              type="text"
              value={usuario?.nome ?? ""}
              onChange={(e) =>
                setUsuario(prev =>
                  prev ? { ...prev, nome: e.target.value } : undefined
                )
              }
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />

            {/* User-name */}
            <label className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={usuario?.username ?? ""}
              onChange={(e) =>
                setUsuario(prev =>
                  prev ? { ...prev, username: e.target.value } : undefined
                )
              }
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />

            {/* bio */}
            <label className="block text-sm font-medium mb-1">
              Bio
            </label>
            <input
              type="text"
              value={usuario?.bio ?? ""}
              onChange={(e) =>
                setUsuario(prev =>
                  prev ? { ...prev, bio: e.target.value } : undefined
                )
              }
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />

            {/* Email */}
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={usuario?.email ?? ""}
              onChange={(e) =>
                setUsuario(prev =>
                  prev ? { ...prev, email: e.target.value } : undefined
                )
              }
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />

            {/* Senha */}
            <label className="block text-sm font-medium mb-1">
              Senha
            </label>

            <div className="relative mb-6">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={usuario?.senha ?? ""}
                onChange={(e) =>
                  setUsuario(prev =>
                    prev ? { ...prev, senha: e.target.value } : undefined
                  )
                }
                className="w-full px-4 py-3 rounded-xl border pr-20"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(prev => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
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
      )}


    </main>
  );
}