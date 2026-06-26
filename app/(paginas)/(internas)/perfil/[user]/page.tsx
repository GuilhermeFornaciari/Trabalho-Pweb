'use client'

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/lib/prisma/generated/client";
import { useSession } from "next-auth/react";
import EditModal from "@/components/user/editModal";

export default function PerfilPage({params,}: {params: Promise<{ user: string }>}) {
    const {user} = use(params);
    const { data: session } = useSession();
    const backgroundImage = "/images/fundo-perfil.jpg";
    const [modalAberto, setModalAberto] = useState(false);
    const [usuario, setUsuario] = useState<User>();
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
      const carregarUsuario = async () => {
        const response = await fetch(`../api/usuario/${user}`);

        if(response.ok){
          const data = await response.json();
          setUsuario(data);
        }
      };

      carregarUsuario();
    }, [refreshKey]);

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
              { session?.user.id === usuario?.id && 
                (
                  <button
                    onClick={() => setModalAberto(true)}
                    className="px-4 py-1.5 rounded-lg bg-[#F7D774] hover:bg-[#F2CF5A] transition text-sm font-semibold text-[#4F442E]"
                  >
                    Editar perfil
                  </button>
                )
              }
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

          
          <EditModal
            open={modalAberto}
            onClose={() => setModalAberto(false)}
            onRefresh={() => setRefreshKey((prev) => prev + 1)}
          />
          </div>
        </div>

        {/* Área futura — postagens, biblioteca, etc. */}
        <div className="mt-10 text-center text-[#8A7A5B] text-sm">
          {/* conteúdo futuro aqui */}
        </div>

      </div>

    </main>
  );
}