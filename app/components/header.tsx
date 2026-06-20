'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";

export default function Header() {
  const pathName = usePathname();
  const navItemsStyle = "mx-2 p-2 font-semibold hover:bg-black hover:text-olive-50 transition ease-linear duration-300 rounded-sm";
  const navItemDestacadoStyle = " text-olive-50 bg-black";
  return (
    <header className="fixed top-0 left-0 w-full h-24 z-50 bg-yellow-300 border-b-3 border-slate-950 flex items-center">
      <div className="w-7xl m-auto flex items-center justify-between">
        <Link href="/catalogo"><Image loading="eager" src="/libris.png" width={70} height={70} alt="Libris logo"/></Link>
        <div>
          <Link href="/adm" className={navItemsStyle + (pathName.match("/adm") ? navItemDestacadoStyle : "")}>Gerenciamento</Link>
          <Link href="/catalogo" className={navItemsStyle + (pathName.match("/catalogo") ? navItemDestacadoStyle : "")}>Catalogo</Link>
        </div>
      </div>
    </header>
  )
}