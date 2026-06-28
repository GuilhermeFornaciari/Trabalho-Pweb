'use client'

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { User, Biblioteca, Livro } from "@/lib/prisma/generated/client";
import { useSession } from "next-auth/react";
import EditarUsuario from "@/components/usuario/editarForm";
import Modal from "@/components/modal";
import BibliotecaContainer from "@/components/biblioteca/bibliotecaContainer";
import EstatisticasPerfil from "@/components/estatistica/estatisiciaUsuario";

export type UsuarioPerfil = User & {
  biblioteca: (Biblioteca & {
    livro: Livro;
    nota: number | null;
    progresso: number | null;
  })[];
};

type AbaDisponivel = 'biblioteca' | 'postagens' | 'estatisticas';


export default function PerfilPage({params,}: {params: Promise<{ user: string }>}) {
    const {user} = use(params);
    const { data: session } = useSession();
    const backgroundImage = "/images/fundo-perfil.jpg";
    const [modalAberto, setModalAberto] = useState(false);
    const [usuario, setUsuario] = useState<UsuarioPerfil>();
    const [refreshKey, setRefreshKey] = useState(0);
    
    const [abaAtiva, setAbaAtiva] = useState<AbaDisponivel>('biblioteca');
    const conteudos = {
      biblioteca: biblioteca(usuario),
      postagens: postagens(usuario),
      estatisticas: estatisticas(usuario),
    };

    useEffect(() => {
      const carregarUsuario = async () => {
        const response = await fetch(`../api/usuario/${user}`);

        if(response.ok){
          const data = await response.json();
          console.log(data);
          setUsuario(data.dados);
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
        <div className="w-5xl mx-auto px-4 py-10">
        {/* Cabeçalho do perfil */}
          <div className="flex items-start justify-around gap-13 pb-8 border-b border-[#E8D89A] w-full">

            {/* Foto */}
            <div className="flex flex-col justify-center items-center gap-2">
              <div className="relative w-50 h-50 flex-shrink-0">
                <Image
                  src={usuario?.foto || "/temp/caju.jpeg"}
                  alt="Foto do usuário"
                  fill
                  className="rounded-full object-cover border-4 border-[#F7D774]"
                />
              </div>
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

            {/* Infos */}
            <div className="flex flex-col flex-1 items-start gap-3 py-5">
                <h1 className="text-3xl font-semibold text-[#4F442E]">{usuario?.nome} <span className="text-gray-400 font-light text-2xl">@{usuario?.username}</span></h1>

                {usuario?.dataNascimento && (
                  <span className="text-[#8A7A5B] text-sm">
                    {new Date().getFullYear() - new Date(usuario.dataNascimento).getFullYear()} anos
                  </span>
                )}

              <p className="text-[#8A7A5B] text-sm max-w-xs"> {usuario?.bio} </p>
           </div>
        </div>

          {(modalAberto && session?.user.id === usuario?.id)  && 
            (
              <Modal open={modalAberto} onClose={() => setModalAberto(false)}>
                <EditarUsuario
                  usuario={usuario}
                  onClose={() => setModalAberto(false)}
                  onRefresh={() => setRefreshKey((prev) => prev + 1)}
                />
              </Modal>
            )
          }

        {/* Sistema de Abas */}
        <div className="mt-8">
          {/* Botões de Seleção das Abas */}
          <div className="flex justify-center gap-4 border-b border-[#E8D89A] pb-3 mb-6">
            {(['biblioteca', 'postagens', 'estatisticas'] as AbaDisponivel[]).map((aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all capitalize
                  ${abaAtiva === aba 
                    ? 'bg-[#F7D774] text-[#4F442E] shadow-sm' 
                    : 'text-[#8A7A5B] hover:bg-[#F7D774]/20'
                  }`}
              >
                {aba}
              </button>
            ))}
          </div>

          {/* Conteúdo Dinâmico baseado na Aba Ativa */}
          <div className="text-center text-[#8A7A5B] text-sm min-h-[200px]">
            {conteudos[abaAtiva]}
          </div>
        </div>

      </div>
    </main>
  );
}

function biblioteca(usuario: UsuarioPerfil | undefined) {
  if(!usuario) return null;

  return (
    <div>
      <h2 className="text-slate-950 text-2xl font-semibold mb-4">Biblioteca</h2>
      <div className="flex flex-wrap justify-center"> 
        <BibliotecaContainer livros={usuario?.biblioteca}/>
      </div>
    </div>
  );
}

function postagens(usuario: UsuarioPerfil | undefined) {
  if(!usuario) return null;

  return (
    <div>
      <h2 className="text-slate-950 text-2xl font-semibold mb-4">Postagens</h2>
      <p>Aqui ficarão as publicações e postagens do usuário.</p>
    </div>
  );
} 

function estatisticas(usuario: UsuarioPerfil | undefined) {
  if(!usuario) return null;

  return (
    <div>
      <h2 className="text-slate-950 text-2xl font-semibold mb-4">Estatísticas</h2>
      <p>Gráficos e dados de leitura do usuário.</p>
        <EstatisticasPerfil usuario={usuario} />
    </div>
  );
}