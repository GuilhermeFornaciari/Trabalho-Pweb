'use client'

import { Book, MessageSquare, Heart, FileText, Users, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface DadosPeriodo {
  total: number;
  crescimentoSemanal: number; 
}

interface LivroRanking {
  id: number;
  titulo: string;
  genero: string;
  totalLeitores: number;
}

interface ColecaoRanking {
  id: number;
  nome: string;
  totalLivrosLidos: number;
}

interface EstatisticasAdmin {
  usuarios: DadosPeriodo;
  resenhas: DadosPeriodo; 
  comentarios: DadosPeriodo;
  curtidas?: DadosPeriodo;
  rankingLivros: LivroRanking[];
  rankingColecoes: ColecaoRanking[];
}

export default function AdminEstatisticas() {
  const [dados, setDados] = useState<EstatisticasAdmin | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarEstatisticas() {
      try {
        const response = await fetch("../api/admin/estatisticas");
        
        if (response.ok) {
          // CORREÇÃO: Lendo o json apenas uma vez e salvando na variável
          const data = await response.json();
          
          console.log("Dados recebidos do backend:", data);
          setDados(data);
        } else {
          console.error("Resposta da API não foi amigável:", response.status);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do painel admin:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarEstatisticas();
  }, []);

  if (carregando) {
    return (
      <div className="w-full text-center py-20 text-[#8A7A5B] font-medium animate-pulse">
        Carregando painel de métricas...
      </div>
    );
  }

  const BadgeCrescimento = ({ valor }: { valor: number }) => {
    const positivo = valor >= 0;
    return (
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
        positivo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
      }`}>
        <TrendingUp size={12} className={positivo ? "" : "rotate-180"} />
        {positivo ? `+${valor}%` : `${valor}%`} esta semana
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-fadeIn space-y-8">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E8D89A] pb-4 gap-4">
        <div>
          <h2 className="text-slate-950 text-2xl font-bold tracking-tight">Painel do Administrador</h2>
          <p className="text-gray-500 text-sm mt-0.5">Visão geral de crescimento, engajamento e atividade da plataforma.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E8D89A] shadow-sm text-xs font-medium text-[#4F442E]">
          <Calendar size={14} className="text-[#8A7A5B]" />
          <span>Métricas Semanais Ativas</span>
        </div>
      </div>

      {/* Grid 1: Métricas de Crescimento e Engajamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card: Novos Usuários */}
        <div className="bg-white border border-[#E8D89A] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-amber-50 rounded-lg text-[#8A7A5B]">
              <Users size={20} />
            </div>
            <BadgeCrescimento valor={dados?.usuarios?.crescimentoSemanal || 0} />
          </div>
          <div>
            <span className="block text-3xl font-extrabold text-[#4F442E]">{dados?.usuarios?.total.toLocaleString() ?? 0}</span>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mt-0.5">Usuários Totais</span>
          </div>
        </div>

        {/* Card: Novas Postagens / Resenhas */}
        <div className="bg-white border border-[#E8D89A] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-amber-50 rounded-lg text-[#8A7A5B]">
              <FileText size={20} />
            </div>
            <BadgeCrescimento valor={dados?.resenhas?.crescimentoSemanal || 0} />
          </div>
          <div>
            <span className="block text-3xl font-extrabold text-[#4F442E]">{dados?.resenhas?.total.toLocaleString() ?? 0}</span>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mt-0.5">Resenhas Criadas</span>
          </div>
        </div>

        {/* Card: Novos Comentários */}
        <div className="bg-white border border-[#E8D89A] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-amber-50 rounded-lg text-[#8A7A5B]">
              <MessageSquare size={20} />
            </div>
            <BadgeCrescimento valor={dados?.comentarios?.crescimentoSemanal || 0} />
          </div>
          <div>
            <span className="block text-3xl font-extrabold text-[#4F442E]">{dados?.comentarios?.total.toLocaleString() ?? 0}</span>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mt-0.5">Comentários</span>
          </div>
        </div>

        {/* Card: Novas Curtidas */}
        <div className="bg-white border border-[#E8D89A] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-amber-50 rounded-lg text-[#8A7A5B]">
              <Heart size={20} />
            </div>
            <BadgeCrescimento valor={dados?.curtidas?.crescimentoSemanal || 0} />
          </div>
          <div>
            <span className="block text-3xl font-extrabold text-[#4F442E]">{dados?.curtidas?.total.toLocaleString() ?? 0}</span>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mt-0.5">Curtidas Dadas</span>
          </div>
        </div>

      </div>

      {/* Grid 2: Rankings (Livros e Coleções) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bloco: Livros Mais Lidos */}
        <div className="bg-white/60 backdrop-blur-sm border border-[#E8D89A] rounded-xl p-5 shadow-sm">
          <h3 className="text-[#4F442E] text-md font-bold mb-4 flex items-center gap-2 border-b border-[#E8D89A] pb-2">
            <Book size={18} className="text-[#8A7A5B]" /> Livros Mais Populares na Estante
          </h3>
          <div className="divide-y divide-slate-100">
            {dados?.rankingLivros && dados.rankingLivros.length > 0 ? (
              dados.rankingLivros.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-[#8A7A5B] bg-[#F7D774]/20 w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.titulo}</p>
                      <span className="text-[10px] text-gray-400 capitalize">{item.genero}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-semibold flex-shrink-0">
                    {item.totalLeitores} leitores
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-6">Sem dados de leitura computados.</p>
            )}
          </div>
        </div>

        {/* Bloco: Coleções Mais Concluídas */}
        <div className="bg-white/60 backdrop-blur-sm border border-[#E8D89A] rounded-xl p-5 shadow-sm">
          <h3 className="text-[#4F442E] text-md font-bold mb-4 flex items-center gap-2 border-b border-[#E8D89A] pb-2">
            <TrendingUp size={18} className="text-[#8A7A5B]" /> Coleções em Destaque
          </h3>
          <div className="divide-y divide-slate-100">
            {dados?.rankingColecoes && dados.rankingColecoes.length > 0 ? (
              dados.rankingColecoes.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-[#4F442E] bg-amber-100 w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-xs font-bold text-slate-800 truncate">{item.nome}</p>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-md font-semibold flex-shrink-0">
                    {item.totalLivrosLidos} volumes lidos
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-6">Nenhuma coleção em andamento.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}