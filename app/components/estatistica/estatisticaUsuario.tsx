'use client'

import { UsuarioPerfil } from "@/lib/types/usuarioPerfil"; 
import { useEffect, useState } from "react";
import GraficoDeLinha from "./graficoDeLinha";
import { BookOpen } from "lucide-react"; 

interface EstatisticasPerfilProps {
  usuario: UsuarioPerfil | undefined;
}

export default function EstatisticasPerfil({ usuario }: EstatisticasPerfilProps) {
  const [leiturasPorMes, setLeiturasPorMes] = useState<{ mes: string; quantidade: number }[]>([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarLeiturasPorMes() {
    if (!usuario?.id) return;
    try {
      setCarregando(true);
      const response = await fetch(`/api/livro/userMontly?usuario=${usuario.id}`);
      if (!response.ok) return;
      
      const resultado = await response.json();
      console.log(resultado);
      setLeiturasPorMes(Array.isArray(resultado) ? resultado : []);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarLeiturasPorMes();
  }, [usuario]);

  const temDadosDeLeitura = leiturasPorMes.some(item => item.quantidade > 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fadeIn">
      {carregando ? (
        // Estado de Carregamento (Skeleton simples)
        <div className="w-full h-[350px] bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
          Carregando estatísticas...
        </div>
      ) : !temDadosDeLeitura ? (
        <div className="w-full h-[350px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-slate-50/50">
          <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-slate-900 font-medium text-base">Nenhuma leitura iniciada</h3>
          <p className="text-slate-500 text-sm max-w-xs mt-1">
            Adicione livros à sua biblioteca e defina uma data de início para começar a ver seus gráficos de progresso.
          </p>
        </div>
      ) : (
        // Gráfico renderiza normalmente se houver dados > 0
        <GraficoDeLinha<{ mes: string; quantidade: number }>
          dados={leiturasPorMes}
          titulo="Novas Leituras Iniciadas por Mês"
          eixoXKey="mes"
          eixoYKey="quantidade"
          nomeLegenda="Livros Adicionados"
          sufixoY=" novos"
        />
      )}
    </div>
  );
}