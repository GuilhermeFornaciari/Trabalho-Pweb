'use client'

import { UsuarioPerfil } from "@/lib/types/usuarioPerfil"; 
import { useEffect, useState } from "react";
import GraficoDeLinha from "./graficoDeLinha";
import GraficoDeBarras from "./graficoDeBarra";

interface EstatisticasPerfilProps {
  usuario: UsuarioPerfil | undefined;
}

export default function EstatisticasPerfil({ usuario }: EstatisticasPerfilProps) {
  const [leiturasPorMes, setLeiturasPorMes] = useState<{ mes: string; quantidade: number }[]>([]);
  const [livrosPorStatus, setLivrosPorStatus] = useState<{ status: string; quantidade: number}[]>([]);
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

  async function carregarLivrosPorStatus() {
    if(!usuario?.id) return;
    try {
      setCarregando(true);
      const response = await fetch(`/api/livro/byStatus?usuario=${usuario.id}`);
      if(!response.ok) return;
      
      const resultado = await response.json();
      console.log(resultado);
      setLivrosPorStatus(Array.isArray(resultado) ? resultado : []);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarLeiturasPorMes();
    carregarLivrosPorStatus();
  }, [usuario]);

  const temLeiturasPorMes = leiturasPorMes.some(item => item.quantidade > 0);
  const temLivrosPorStatus = livrosPorStatus.some(item => item.quantidade > 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fadeIn">
      {carregando ? (
        <div className="w-full h-[350px] animate-pulse rounded-lg flex items-center justify-center text-slate-400">
          Carregando estatísticas...
        </div>
      ) : (
        <>
          {(temLeiturasPorMes || temLivrosPorStatus) ?
            <>
              {exibirLeiturasPorMes(leiturasPorMes, temLeiturasPorMes)}
              {exibirLivrosPorStatus(livrosPorStatus, temLivrosPorStatus)}
            </>
            :
            <h1>Não há dados de estatísticas para exibir no momento. Adicione novos livros na biblioteca.</h1>
          }
        </>
        )
      }
    </div>
  );
}

function exibirLeiturasPorMes(dados: {mes:string; quantidade: number}[], temDados: boolean) {
  return (
    <>
      {temDados && (
        <GraficoDeLinha<{ mes: string; quantidade: number }>
          dados={dados}
          titulo="Quantidade de leituras iniciadas por mês (2026)"
          eixoXKey="mes"
          eixoYKey="quantidade"
          nomeLegenda="Livros Adicionados"
          sufixoY=" novos"
          className = "flex flex-col items-center justify-center w-full max-w-3xl p-4 rounded-lg"
          />
        )
      }
    </>
  );
}

function exibirLivrosPorStatus(dados: { status: string; quantidade: number}[], temDados:boolean) {
  return (
    <>
      {temDados && (
        <div className="w-sm">
          <GraficoDeBarras<{status: string; quantidade: number}>
            dados={dados}
            titulo=""
            eixoXKey="status"
            eixoYKey="quantidade"
            orientacao="vertical"
            nomeLegenda="Livros"
            className="flex flex-col items-center justify-center w-full max-w-3xl p-4 rounded-lg"
            />
        </div>
      )}
    </>
  );
}