import Image from "next/image"

export default function Header() {
  return (
    <header className="bg-yellow-400 border-b-3 border-slate-950">
      <div className="w-7xl m-auto">
        <Image src="/libris.png" width={70} height={70} alt="Libris logo"/>
      </div>
    </header>
  )
}