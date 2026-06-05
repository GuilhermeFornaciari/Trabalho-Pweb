'use client'

import { useState } from "react";
import { findUser } from "./LoginService";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const backgroundImage = "/images/registro-bg.jpg";
  const router = useRouter();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async () => {
    const user = await findUser(email, senha);

    if (user !== null) {
      router.push("/user");
    } else {
        alert("Usuário não encontrado")
    }
  }

const registerUser = async () => {
      router.push("/register");
  }


  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(255,248,235,0.10), rgba(255,248,235,0.50)), url(${backgroundImage})`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-[#FFFDF8]/90 border border-[#F3E5AB] rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/"><Image src="/libris-lg.png" className="m-auto" width={100} height={100} alt="Libris logo"/></Link>

            <p className="text-[#8A7A5B] mt-2">
              Acesse sua conta e registre o progresso de suas leituras.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-[#6B5B3E]">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                  onChange={(e) => setEmail(e.target.value)}
                placeholder="email@email.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E8D89A] bg-white outline-none focus:ring-2 focus:ring-[#F6D86B]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-[#6B5B3E]">
                Senha
              </label>

              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
        
                  placeholder="senha123"
                  className="w-full px-4 py-3 pr-20 rounded-xl border border-[#E8D89A] bg-white outline-none focus:ring-2 focus:ring-[#F6D86B]"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#6B5B3E]"
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-[#F7D774] hover:bg-[#F2CF5A] transition text-[#4F442E] font-semibold"
            >
              Entrar
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[#E8D89A]" />
            <span className="px-4 text-sm text-[#8A7A5B]">
              ou
            </span>
            <div className="flex-1 h-px bg-[#E8D89A]" />
          </div>

          <button
              type="button"
              onClick={registerUser}
            className="w-full py-3 rounded-xl border border-[#E8D89A] bg-[#FFF7D6] hover:bg-[#FFF1B8] transition text-[#6B5B3E] font-medium"
          >
            Criar conta
          </button>
        </div>
      </div>
    </main>
  );
}