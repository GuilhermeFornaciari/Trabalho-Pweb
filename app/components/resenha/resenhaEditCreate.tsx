import { Star } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  setTitulo: (value: string) => void;
  resenha: string;
  setResenha: (value: string) => void;
  nota: number;
  setNota: (value: number) => void;
  spoiler: boolean;
  setSpoiler: (value: boolean) => void;
  onSubmit: () => void;
};

export default function ResenhaEditeCreateModal({
  isOpen,
  onClose,
  titulo,
  setTitulo,
  resenha,
  setResenha,
  nota,
  setNota,
  spoiler,
  setSpoiler,
  onSubmit,
}: Props) {
  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Nova Resenha</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Classificação por Estrelas */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((valor) => (
              <Star
                key={valor}
                size={32}
                onClick={() => setNota(valor)}
                className={`cursor-pointer ${
                  valor <= nota ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Campo Título */}
          <div>
            <label className="block mb-1 font-medium">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          {/* Campo Texto da Resenha */}
          <div>
            <label className="block mb-1 font-medium">Resenha</label>
            <textarea
              value={resenha}
              onChange={(e) => setResenha(e.target.value)}
              rows={8}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          {/* Checkbox de Spoiler */}
          <label className="flex items-center gap-2 cursor-pointer integrated-inputs">
            <input
              type="checkbox"
              checked={spoiler}
              onChange={(e) => setSpoiler(e.target.checked)}
            />
            Contém spoiler
          </label>

          {/* Ações do Modal */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Salvar Resenha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}