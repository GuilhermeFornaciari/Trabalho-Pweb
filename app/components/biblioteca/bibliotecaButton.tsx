import { useState } from "react";
import { LivroDetalhes } from "@/lib/types/livroDetalhes";
import Modal from "@/components/modal";
import { StatusLeitura } from "@/lib/prisma/generated/enums";

export default function BibliotecaButton({
  livro,
  buttonStyle
}: {
  livro: LivroDetalhes,
  buttonStyle: string
}) {
  const [modal, setModal] = useState(false);
  const status = Object.values(StatusLeitura);
  const [statusSelecionado, setStatusSelecionado] = useState<StatusLeitura | null>(livro.biblioteca?.status ?? null);

  async function adicionar() {
    
  }

  if(livro.biblioteca === null) {
    return (
      <>
        <button className={buttonStyle + " " + "bg-lime-400"} onClick={() => setModal(true)}>Adicione à biblioteca</button>
        <Modal open={modal} onClose={() => setModal(false)}>
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
                    checked={statusSelecionado === item}
                    onChange={() => setStatusSelecionado(item)}
                    value={item}
                  />
                  <label htmlFor={`status-${index}`} className="ml-2">
                    {formatarInputRadioText(item)}
                  </label>
                </div>
              ))}
            </div>
            <button className={"bg-lime-400 rounded-md w-full py-1"} onClick={() => setModal(false)}>Salvar</button>
          </div>
        </Modal>
      </>
    );
  }
}

function formatarInputRadioText(texto: string) {
  if(!texto) return '';
  return (texto.charAt(0) + texto.slice(1).toLowerCase()).replace("_", " ");
}