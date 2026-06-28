import { Livro } from "@/lib/prisma/generated/client"

export default function ProgressoForm({
  livro,
}: {
  livro: Livro
}) {
  return (
    <div className="bg-white flex flex-col w-3xl p-5 rounded-md">
      <h1 className="text-xl font-semibold mb-5">Registrar progresso</h1>
      <div className="flex flex-col gap-3">
        <textarea 
          name="impressao" 
          id="impressao" 
          placeholder="Conte suas impressões sobre o que você leu até o momento (opcional)"
          className="resize-none border p-3 rounded-md outline-none"
        >
        </textarea>
        <input type="text" name="paginas" id="paginas" placeholder="Digite seu progresso" className="border p-3 rounded-md outline-none"/>
        <div className="flex justify-between w-lg m-auto">
          <div className="flex items-center">
            <input type="radio" name="progressoFormato" id="inteiro" checked/>
            <label htmlFor="inteiro" className="pl-3">Páginas</label>
          </div>
          <div className="flex items-center">
            <input type="radio" name="progressoFormato" id="porcentagem" />
            <label htmlFor="porcentagem" className="pl-3">Porcentagem</label>
          </div>
        </div>

      </div>
    </div>
  )
}