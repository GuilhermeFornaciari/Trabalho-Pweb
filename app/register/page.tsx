'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "./RegisterService";

export default function LoginPage() {
  const backgroundImage = "/livros.jpeg";
  const router = useRouter();

  const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const voltar = () => {
        router.push("/login");
    }

    const handleSubmit = async () => {

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem");
            return;
        }

        if(email == "" || senha =="" || nome ==""){
            alert("Preencha todos os campos!")
        }else {

            const newUser = await createUser(email, senha, nome);
            if(newUser !== null){
                router.push("/login");
            }
        }
    };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(255,248,235,0.30), rgba(255,248,235,0.75)), url(${backgroundImage})`,
      }}
    >
      <div className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-[#FFFDF8]/90 border border-[#F3E5AB] rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#6B5B3E]">
              Libris
            </h1>

            <p className="text-[#8A7A5B] mt-2">
              Resenhas, notas e discussões sobre livros
            </p>
          </div>

          <form className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-[#6B5B3E]">
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 rounded-xl border border-[#E8D89A] bg-white outline-none focus:ring-2 focus:ring-[#F6D86B]"
            />
          </div>

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
                placeholder="Digite sua senha"
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

          <div>
            <label className="block mb-2 text-sm text-[#6B5B3E]">
              Confirmar senha
            </label>

            <div className="relative">
              <input
                type={mostrarConfirmacao ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Digite novamente sua senha"
                className="w-full px-4 py-3 pr-20 rounded-xl border border-[#E8D89A] bg-white outline-none focus:ring-2 focus:ring-[#F6D86B]"
              />

              <button
                type="button"
                onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#6B5B3E]"
              >
                {mostrarConfirmacao ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-[#F7D774] hover:bg-[#F2CF5A] transition text-[#4F442E] font-semibold"
          >
            Criar conta
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
          onClick={voltar}
            className="w-full py-3 rounded-xl border border-[#E8D89A] bg-[#FFF7D6] hover:bg-[#FFF1B8] transition text-[#6B5B3E] font-medium"
          >
            Voltar
          </button>
        </div>
      </div>
    </main>
  );
}