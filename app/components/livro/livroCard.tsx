import { Livro } from "@/lib/prisma/generated/client"
import Link from "next/link"

export default function LivroCard ({
  livro,
  children,
  imgBorder,
}: {
  livro: Livro,
  children: React.ReactNode
  imgBorder: string
}) {
  return (
    <>
      <div className={"transition w-40 h-64 flex flex-col justify-between"}>
        <div className={"h-52 w-full rounded-2xl overflow-hidden border-5 " + imgBorder}>
          <img
            src={livro.capa}
            alt={livro.titulo}
            className="w-full h-full object-fill"
            />
        </div>
        {children}
        <div>
          <h2 className="font-semibold text-[#4F442E] line-clamp-2 truncate">
            {livro.titulo}
          </h2>
        </div>
      </div>
    </>
  )

}