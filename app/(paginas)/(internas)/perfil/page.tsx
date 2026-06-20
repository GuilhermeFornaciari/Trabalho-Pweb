'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/lib/prisma/generated/client";


export default function LoginPage() {
  const backgroundImage = "/images/fundo-perfil.jpg";

    // const [mostrarSenha, setMostrarSenha] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

    const [mostrarSenha, setMostrarSenha] = useState(false);
    
    const [usuario, setUsuario] = useState<User>();

    useEffect(() => {
      const carregarUsuario = async () => {

        setUsuario({id: 0 , nome: "bino", email: "binoDelicia@hotmail.com", senha: "123321", foto: "/temp/caju.jpeg"})
        
        // const dados = localStorage.getItem("usuario");
        // if (dados) {
          // setUsuario(JSON.parse(dados));
        // }
      };

      carregarUsuario();
    }, []);


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
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed px-140"
      style={{
        backgroundImage: `linear-gradient(rgba(255,248,235,0.10), rgba(255,248,235,0.10)), url(${backgroundImage})`,
      }} >

            
      <div className="w-full max-w-md mx-auto">
        <div className="bg-[#FFFDF8] rounded-3xl shadow-xl p-8 text-center">

          <div className="relative w-32 h-32 mx-auto">
            <Image
              src={usuario?.foto || "/default-user.png"}
              alt="Foto do usuário"
              fill
              className="rounded-full object-cover border-4 border-[#F7D774]"
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#4F442E]">
            {usuario?.nome}
          </h1>

          <p className="mt-2 text-[#8A7A5B]">
            {usuario?.email}
          </p>

          <button
            onClick={() => setModalAberto(true)}
            className="mt-8 px-6 py-3 rounded-xl bg-[#F7D774] hover:bg-[#F2CF5A] transition font-semibold"
          >
            Editar Perfil
          </button>

        </div>
      </div>


      {modalAberto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="bg-white rounded-3xl p-8 w-full max-w-md"
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
      )}


    </main>
  );
}