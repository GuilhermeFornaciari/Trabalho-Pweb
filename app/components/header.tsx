import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-yellow-300 border-b-3 border-slate-950">
      <div className="w-7xl m-auto">
        <Link href="/catalogo"><Image loading="eager" src="/libris.png" width={70} height={70} alt="Libris logo"/></Link>
      </div>
    </header>
  )
}