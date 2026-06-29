import { Trash2, SquarePen } from "lucide-react";

type MenuAcoesProps = {
  editando?: boolean;
  onEditar?: () => void;
  onApagar?: () => void;
  onClose: () => void;
  style: string;
};

export default function MenuAcoes({
  editando = false,
  onEditar,
  onApagar,
  onClose,
  style,
}: MenuAcoesProps) {
  return (
    <div className={style}>

      {onEditar && (
        <button
          onClick={() => {
            onEditar();
            onClose();
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 transition-colors"
        >
          <SquarePen size={16} />
          {editando ? "Cancelar edição" : "Editar"}
        </button>
      )}

      {onApagar && (
        <button
          onClick={() => {
            onApagar();
            onClose();
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
          Apagar
        </button>
      )}
    </div>
  );
}