'use client'

import { User } from "@/lib/prisma/generated/client";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { setEngine } from "crypto";

export default function Header() {
  const {data: session} = useSession();
  const pathName = usePathname();
  const navItemsStyle = "mx-2 p-2 font-semibold hover:bg-black hover:text-olive-50 transition ease-linear duration-300 rounded-sm";
  const navItemDestacadoStyle = " text-olive-50 bg-black";
  
  const [perfilOpc, setPerfilOpc] = useState(false);

  const foto = (session?.user as User)?.foto || "/temp/calca.jpeg";
  const rotaPerfil = session?.user ? `/perfil/${session.user.id}` : "/login";

  return (
    <header className="fixed top-0 left-0 w-full h-24 z-50 bg-yellow-300 border-b-3 border-slate-950 flex items-center">
      <div className="w-7xl m-auto flex items-center justify-between">
        <Link href="/catalogo"><Image loading="eager" src="/libris.png" width={70} height={70} alt="Libris logo"/></Link>
        <div>
          {session?.user?.role === "admin" &&
            (<Link href="/adm" className={navItemsStyle + (pathName.match("/adm") ? navItemDestacadoStyle : "")}>Gerenciamento</Link>)
          }
          <Link href="/catalogo" className={navItemsStyle + (pathName.match("/catalogo") ? navItemDestacadoStyle : "")}>Catalogo</Link>
        </div>

         <div className="relative">
            <div className="relative w-14 h-14 cursor-pointer" onClick={() => setPerfilOpc(!perfilOpc)}>
              <Image src={foto} alt="Foto do usuário" fill className="rounded-full object-cover border-2 border-black"/>
              {/* <span className="absolute right-0 top-16">Olá, </span> */}
            </div>

            {perfilOpc && (
              <div className="absolute right-0 top-16 bg-white border border-gray-300 rounded-md shadow-lg min-w-[180px] overflow-hidden">
                <Link href={rotaPerfil} onClick={() => setPerfilOpc(!perfilOpc)} className="block px-4 py-2 hover:bg-gray-100">
                  Acessar Perfil
                </Link>

                <button
                  onClick={async () => {
                    await signOut({
                      redirect: true,
                      callbackUrl: "/",
                    });
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Sair
                </button>
              </div>
            )}
          </div>

      </div>
    </header>
  )
}