import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen items-center justify-center bg-[url('/banner-bg.jpg')] bg-cover bg-center font-sans dark:bg-black">
      <div className="flex flex-col items-begin justify-center bg-black/50 w-full h-full">
        <div className="h-full w-sm flex flex-col items-center justify-around bg-amber-50 text-black text-center">
            <Image src="/libris-lg.png" width={100} height={100} alt="Libris logo"/>
            <div className="p-2">

              <h1 className="text-5xl">Bem-vindo!</h1>
              <p className="my-5">Registre suas leituras, avalie seus livros favoritos e interaja com outros leitores.</p>

            </div>
            <p>Acesse sua conta <a className="text-yellow-500" href="http://">agora</a> ou <a className="text-yellow-500" href="http://">cadastre-se</a></p>
        </div>
      </div>
    </div>
  );

}
