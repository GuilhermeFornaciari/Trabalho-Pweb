import { useState } from "react";
import { LivroDetalhes } from "@/lib/types/livroDetalhes";
import Modal from "@/components/modal";
import { StatusLeitura } from "@/lib/prisma/generated/enums";
import { useSession } from "next-auth/react";
// import Biblioteca from "@/(entidades)/biblioteca";
import { statusStyle } from "@/lib/types/statusStyle";
import { Biblioteca } from "@/lib/prisma/generated/client";

export default function BibliotecaButton({
  livro,
  buttonStyle,
  onUpdate
}: {
  livro: LivroDetalhes,
  buttonStyle: string,
  onUpdate: (dados: Biblioteca) => void
}) {
  const [modal, setModal] = useState(false);
  const status = Object.values(StatusLeitura);
  const [statusSelecionado, setStatusSelecionado] = useState<StatusLeitura | null>(livro.biblioteca?.status ?? null);
  const {data: session} = useSession();
  

  async function salvarStatus() {
    const response = await fetch(`/api/biblioteca/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        livroId: livro.id,
        status: statusSelecionado
      })
    })

    if(!response.ok) {
      const erro = await response.json();
      alert("ERRO: " + erro.message);
    }

    const dados = await response.json();
    onUpdate(dados.dados);
  }

  async function handleSubmit() {
    if(!session?.user.id) {
      alert("Você precisa estar logado!");
      return;
    }

    if(statusSelecionado === null) {
      alert("Selecione uma opção");
      return;
    }

    salvarStatus();
    setModal(false);
  }

  if(session?.user.role === "admin") {
    return;
  }

  return (
    <>
      {(livro.biblioteca === null) ?
       <button className={buttonStyle + " " + "w-full cursor-pointer bg-lime-400"} onClick={() => setModal(true)}>Adicione à biblioteca</button> :
       <button className={buttonStyle + " " + `w-full cursor-pointer ${statusStyle[livro.biblioteca.status].background}`} onClick={() => setModal(true)}>{formatarStatusText(livro.biblioteca.status.toString())}</button> 
      }

      <Modal open={modal} 
        onClose={() => {
          setStatusSelecionado(livro.biblioteca?.status ?? null);
          setModal(false)
        }}>
        <div className="bg-white p-6 rounded-md">
          <h1 className="text-center mb-5 text-lg font-semibold">Adicione <span className="font-bold text-amber-500">{livro.titulo}</span> na sua biblioteca</h1>
          <p>Selecione o status da sua leitura:</p>
          <div className="p-3 my-3 border border-amber-400 rounded-md">
            {status.map((item, index) => (
              <div key={item} className="flex items-center">
                <input
                  type="radio"
                  id={`status-${index}`}
                  name="status"
                  className={statusStyle[item].accent}
                  checked={statusSelecionado === item}
                  onChange={() => setStatusSelecionado(item)}
                  value={item}
                />
                <label htmlFor={`status-${index}`} className="ml-2">
                  {formatarStatusText(item)}
                </label>
              </div>
            ))}
          </div>
          <button 
            className={"bg-lime-400 rounded-md w-full py-1 transition duration-300 disabled:bg-gray-300 disabled:text-gray-500"} 
            onClick={() => handleSubmit()} 
            disabled={statusSelecionado === null}
          >
            Salvar
          </button>
        </div>
      </Modal>
    </>
  );
}

function formatarStatusText(texto: string) {
  if(!texto) return '';
  return (texto.charAt(0) + texto.slice(1).toLowerCase()).replace("_", " ");
}