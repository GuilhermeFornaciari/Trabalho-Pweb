import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen items-center justify-center bg-[url('/banner-bg.jpg')] bg-cover bg-center font-sans dark:bg-black">
      <div className="flex flex-col items-center justify-center bg-black/50 w-full h-full">
        <div className="flex flex-col text-amber-50 w-7xl">
          <h1 className="text-5xl">Bem vindo ao <span className="text-amber-300">Libris</span>!</h1>
          <p className="text-lg my-5">Registre suas leituras, avalie seus livros favoritos e interaja com outros leitores.</p>
        </div>
      </div>
    </div>
  );
}
