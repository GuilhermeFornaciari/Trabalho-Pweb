interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  onPaginaChange: (pagina: number) => void;
  children?: React.ReactNode;
  isModal?: boolean; 
}

export default function Paginacao({
  paginaAtual,
  totalPaginas,
  onPaginaChange,
  children,
  isModal = false, 
}: PaginacaoProps) {
  
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl">
          {children}
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <button disabled={paginaAtual === 1} onClick={() => onPaginaChange(paginaAtual - 1)}>Anterior</button>
            <span>{paginaAtual} de {totalPaginas}</span>
            <button disabled={paginaAtual === totalPaginas} onClick={() => onPaginaChange(paginaAtual + 1)}>Próximo</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full"> 
      <div className="w-full">
        {children}
      </div>

      {/* Barra de paginação */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-6 w-full">
        <button
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={paginaAtual === 1}
          onClick={() => onPaginaChange(paginaAtual - 1)}
        >
          Anterior
        </button>
        
        <span className="text-sm font-medium text-slate-600">
          Página <strong className="text-slate-800">{paginaAtual}</strong> de <strong className="text-slate-800">{totalPaginas}</strong>
        </span>

        <button
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={paginaAtual === totalPaginas}
          onClick={() => onPaginaChange(paginaAtual + 1)}
        >
          Próximo
        </button>
      </div>
    </div>
  );

}