import { useState } from "react";
import { LivroDetalhes } from "@/lib/types/livroDetalhes";
import BibliotecaModal from "./bibliotecaModal";

export default function BibliotecaButton({
  livro,
  buttonStyle
}: {
  livro: LivroDetalhes,
  buttonStyle: string
}) {
  const [modal, setModal] = useState(false);
  const status = ["Lido", "Lendo", "Quero ler", "Abandonei"];

  if(livro.biblioteca === null) {
    return (
      <>
        <button className={buttonStyle + " " + "bg-lime-400"} onClick={() => setModal(true)}>Adicione à biblioteca</button>
        <BibliotecaModal open={modal}>
          <div className="bg-white p-4 rounded-md">
            <h1 className="text-center mb-5 text-lg font-semibold">Adicione <span className="font-bold">{livro.titulo}</span> à sua coleção</h1>
            <p>Selecione o status da sua leitura:</p>
            <div className="p-3 my-3 border border-amber-400 rounded-md">
              {status.map((item, index) => (
                <div key={item} className="flex items-center">
                  <input
                    type="radio"
                    id={`status-${index}`}
                    name="status"
                    value={item}
                  />
                  <label htmlFor={`status-${index}`} className="ml-2">
                    {item}
                  </label>
                </div>
              ))}
            </div>
            <button className={"bg-lime-400 rounded-md w-full py-1"} onClick={() => setModal(false)}>Salvar</button>
          </div>
        </BibliotecaModal>
      </>
    );
  }

}