import { Livro, Postagem } from "@/lib/prisma/generated/client"
import { useEffect, useState } from "react"

export default function ProgressoForm({
  livro,
  progresso,
  onClose,
  onSave
}: {
  livro: Livro,
  progresso: Postagem | null
  onClose: () => void ,
  onSave: () => void
}) {
  const [formatoSelecionado, setFormatoSelecionado] = useState("inteiro");
  const [form, setForm] = useState({
    texto: "",
    pagina: "",
    spoiler: false,
  });

  const pagina = progresso?.paginaAtual ?? 0;
  const porcentagemAtual = Math.floor((pagina/livro.paginas) * 100);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: (name === "pagina") ? value.replace(/\D/g, "") : value,
    }));
  }

async function RegistrarProgresso() {
  if(form.pagina.length === 0 || isNaN(Number(form.pagina))) {
    alert("Valor fornecido para página é inválido!");
    return;
  }

  const valor = Number(form.pagina);

  if(formatoSelecionado === "porcentagem" && (valor < 0 || valor > 100)) {
    alert("A porcentagem deve estar entre 0 e 100.");
    return;
  }

  const pg = (formatoSelecionado === "inteiro")
      ? valor
      : Math.round((valor / 100) * livro.paginas);

  if(pg <= pagina) {
    alert("O progresso informado deve ser maior que o atual.");
    return;
  }

  if(pg > livro.paginas) {
    alert(`O livro possui apenas ${livro.paginas} páginas.`);
    return;
  }

  const req = await fetch("/api/progresso/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paginaAtual: pg,
      paginasLidas: pg - pagina,
      texto: form.texto,
      livroId: livro.id,
      temSpoiler: form.texto.length > 0 ? form.spoiler : false,
    }),
  });

  if(!req.ok) {
    alert("Falha ao registrar progresso");
    return;
  }

  await onSave();
  onClose();
}

  return (
    <div className="relative bg-white flex flex-col w-3xl p-5 pb-13 rounded-md overflow-hidden">
      <h1 className="text-xl font-semibold mb-5">Registrar progresso</h1>
      <div className="flex flex-col gap-3">
        <textarea 
          name="texto" 
          id="impressao" 
          value={form.texto}
          onChange={handleChange}
          placeholder="Conte suas impressões sobre o que você leu até o momento (opcional)"
          className="resize-none border p-3 rounded-md outline-none h-48"
        >
        </textarea>
        <div>
          <input
            type="checkbox"
            id="spoiler"
            checked={form.spoiler}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                spoiler: e.target.checked,
              }))
            }
            />

          <label htmlFor="spoiler" className="ml-2">
            Contém spoiler
          </label>
          </div>
        <p className="font-semibold">Página atual</p>
        <input type="text" name="pagina" value={form.pagina} onChange={handleChange} id="paginas" inputMode="numeric" placeholder="Digite seu progresso" className="border p-3 rounded-md outline-none"/>
        <div className="flex justify-between w-lg m-auto">
          <div className="flex items-center">
            <input type="radio" name="progressoFormato" id="inteiro" value="inteiro" 
              checked={formatoSelecionado === "inteiro"} 
              onChange={() => setFormatoSelecionado("inteiro")}
            />
            <label htmlFor="inteiro" className="pl-3">Páginas</label>
          </div>
          <div className="flex items-center">
            <input type="radio" name="progressoFormato" id="porcentagem" value="porcentagem"
              checked={formatoSelecionado === "porcentagem"}
              onChange={() => setFormatoSelecionado("porcentagem")}
            />
            <label htmlFor="porcentagem" className="pl-3">Porcentagem</label>
          </div>
        </div>
        {
          <p className="font-semibold mt-3">
            Progresso atual: <span className="text-green-500">{pagina}</span> / <span>{livro.paginas}</span> - <span className="text-green-500">{porcentagemAtual + "%"}</span>
          </p>
        }
      </div>
      <button onClick={RegistrarProgresso} className="absolute bottom-0 right-0 left-0 bg-yellow-400 py-2 font-semibold">Salvar</button>
    </div>
  )
}