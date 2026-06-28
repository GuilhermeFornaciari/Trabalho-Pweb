'use client'

import { UsuarioPerfil } from "@/lib/types/usuarioPerfil"; // Ajuste o caminho se necessário
import { StatusLeitura } from "@/lib/prisma/generated/client";

// --- DADOS FICTÍCIOS (MOCK DATA) ---
// Simulando exatamente a estrutura gerada pelo seu Schema do Prisma
const mockBiblioteca: UsuarioPerfil['biblioteca'] = [
  {
    usuarioId: "user-123",
    livroId: 1,
    status: "LIDO" as StatusLeitura,
    dataInicio: new Date("2026-01-05"),
    dataConclusao: new Date("2026-01-20"), // 15 dias de leitura
    livro: {
      id: 1,
      titulo: "O Hobbit",
      ano: 1937,
      genero: "Fantasia",
      paginas: 320,
      capa: "/temp/hobbit.jpg",
      createdAt: new Date(),
      sinopse: "A jornada de Bilbo Bolseiro...",
      colecaoId: null,
      posicao_colecao: null,
    }
  },
  {
    usuarioId: "user-123",
    livroId: 2,
    status: "LIDO" as StatusLeitura,
    dataInicio: new Date("2026-02-01"),
    dataConclusao: new Date("2026-02-25"), // 24 dias de leitura
    livro: {
      id: 2,
      titulo: "Duna",
      ano: 1965,
      genero: "Ficção Científica",
      paginas: 680,
      capa: "/temp/duna.jpg",
      createdAt: new Date(),
      sinopse: "A epopeia de Paul Atreides...",
      colecaoId: null,
      posicao_colecao: null,
    }
  },
  {
    usuarioId: "user-123",
    livroId: 3,
    status: "LIDO" as StatusLeitura,
    dataInicio: new Date("2026-03-10"),
    dataConclusao: new Date("2026-03-18"), // 8 dias de leitura
    livro: {
      id: 3,
      titulo: "O Nome do Vento",
      ano: 2007,
      genero: "Fantasia",
      paginas: 656,
      capa: "/temp/nomedovento.jpg",
      createdAt: new Date(),
      sinopse: "A história de Kvothe...",
      colecaoId: null,
      posicao_colecao: null,
    }
  },
  {
    usuarioId: "user-123",
    livroId: 4,
    status: "LENDO" as StatusLeitura,
    dataInicio: new Date("2026-06-01"),
    dataConclusao: null,
    livro: {
      id: 4,
      titulo: "Corte de Espinhos e Rosas",
      ano: 2015,
      genero: "Fantasia",
      paginas: 434,
      capa: "/temp/acotar.jpg",
      createdAt: new Date(),
      sinopse: "A jornada de Feyre...",
      colecaoId: null,
      posicao_colecao: null,
    }
  },
  {
    usuarioId: "user-123",
    livroId: 5,
    status: "QUERO_LER" as StatusLeitura,
    dataInicio: null,
    dataConclusao: null,
    livro: {
      id: 5,
      titulo: "Neuromancer",
      ano: 1984,
      genero: "Ficção Científica",
      paginas: 320,
      capa: "/temp/neuro.jpg",
      createdAt: new Date(),
      sinopse: "O início do cyberpunk...",
      colecaoId: null,
      posicao_colecao: null,
    }
  }
];

interface EstatisticasPerfilProps {
  usuario: UsuarioPerfil | undefined;
}

export default function EstatisticasPerfil({ usuario }: EstatisticasPerfilProps) {
  // SE o usuário real vindo do banco não tiver dados na biblioteca,
  // nós injetamos o mockBiblioteca para fins de exibição/teste.
  const registros = usuario?.biblioteca && usuario.biblioteca.length > 0 
    ? usuario.biblioteca 
    : mockBiblioteca;

  // --- CÁLCULOS COM OS DADOS ---
  const livrosLidos = registros.filter(b => b.status === "LIDO");
  const livrosLendo = registros.filter(b => b.status === "LENDO");
  const livrosQueroLer = registros.filter(b => b.status === "QUERO_LER");
  const totalLivros = livrosLidos.length;

  const totalPaginasLidas = livrosLidos.reduce((acc, curr) => acc + (curr.livro?.paginas || 0), 0);
  const mediaPaginasPorLivro = totalLivros > 0 ? Math.round(totalPaginasLidas / totalLivros) : 0;

  let totalDiasLeitura = 0;
  let livrosComTempoValido = 0;

  livrosLidos.forEach(b => {
    if (b.dataInicio && b.dataConclusao) {
      const inicio = new Date(b.dataInicio).getTime();
      const conclusao = new Date(b.dataConclusao).getTime();
      const diferencaDias = Math.ceil((conclusao - inicio) / (1000 * 60 * 60 * 24));
      
      if (diferencaDias >= 0) {
        totalDiasLeitura += diferencaDias;
        livrosComTempoValido++;
      }
    }
  });

  const tempoMedioPorLivro = livrosComTempoValido > 0 
    ? Math.round(totalDiasLeitura / livrosComTempoValido) 
    : 0;

  // Gênero Favorito
  const generosContagem: { [key: string]: number } = {};
  livrosLidos.forEach(b => {
    const genero = b.livro?.genero || "Não Informado";
    generosContagem[genero] = (generosContagem[genero] || 0) + 1;
  });
  const generoFavorito = Object.entries(generosContagem).sort((a, b) => b[1] - a[1])[0]?.[0] || "Nenhum";

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-slate-950 text-2xl font-semibold">Estatísticas de Leitura</h2>
        {(!usuario?.biblioteca || usuario.biblioteca.length === 0) && (
          <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2.5 py-0.5 rounded border border-amber-300">
            Modo de Demonstração (Mock)
          </span>
        )}
      </div>
      
      {/* Grid Principal de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Livros Concluídos */}
        <div className="bg-[#F7D774]/20 border border-[#E8D89A] rounded-xl p-5 text-center transition-all hover:scale-[1.02]">
          <span className="block text-4xl font-bold text-[#4F442E]">{totalLivros}</span>
          <span className="text-[#8A7A5B] text-sm font-semibold uppercase tracking-wider block mt-1">
            Livros Lidos
          </span>
        </div>

        {/* Card 2: Total de Páginas */}
        <div className="bg-[#F7D774]/20 border border-[#E8D89A] rounded-xl p-5 text-center transition-all hover:scale-[1.02]">
          <span className="block text-4xl font-bold text-[#4F442E]">{totalPaginasLidas.toLocaleString()}</span>
          <span className="text-[#8A7A5B] text-sm font-semibold uppercase tracking-wider block mt-1">
            Páginas Lidas
          </span>
        </div>

        {/* Card 3: Gênero Favorito */}
        <div className="bg-[#F7D774]/20 border border-[#E8D89A] rounded-xl p-5 text-center flex flex-col justify-center items-center transition-all hover:scale-[1.02]">
          <span className="block text-2xl font-bold text-[#4F442E] truncate max-w-full capitalize">
            {generoFavorito}
          </span>
          <span className="text-[#8A7A5B] text-sm font-semibold uppercase tracking-wider block mt-1">
            Gênero Favorito
          </span>
        </div>

      </div>

      {/* Ritmo & Médias */}
      <div className="bg-white/60 backdrop-blur-sm border border-[#E8D89A] rounded-xl p-6 shadow-sm text-left">
        <h3 className="text-[#4F442E] text-lg font-semibold mb-4 border-b border-[#E8D89A] pb-2">
          Ritmo & Médias Gerais
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Tempo Médio p/ Livro</p>
            <p className="text-[#4F442E] text-xl font-bold mt-1">
              {tempoMedioPorLivro > 0 ? `${tempoMedioPorLivro} dias` : "N/A"}
            </p>
            <p className="text-gray-400 text-[11px] mt-0.5">Média calculada de ritmo pessoal</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Tamanho Médio das Obras</p>
            <p className="text-[#4F442E] text-xl font-bold mt-1">{mediaPaginasPorLivro} págs</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Por livro finalizado</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Situação da Estante</p>
            <div className="text-[#4F442E] text-sm mt-2 space-y-1">
              <div className="flex justify-between max-w-[120px]"><span>📖 Lendo:</span> <span className="font-bold">{livrosLendo.length}</span></div>
              <div className="flex justify-between max-w-[120px]"><span>📌 Quero ler:</span> <span className="font-bold">{livrosQueroLer.length}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}