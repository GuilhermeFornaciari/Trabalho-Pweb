'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type UsuarioBusca = {
  id: string;
  nome: string;
  username: string;
  foto: string;
  isFriend?: boolean;
};

type Amigo = {
  id: string;
  nome: string;
  username: string;
  foto: string;
};

export default function AmigosPage() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<UsuarioBusca[]>([]);
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const carregarDados = async (valor: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/amigos?search=${encodeURIComponent(valor)}`);
      if (!response.ok) throw new Error('Falha ao buscar usuários');
      const data = await response.json();
      setResultados(Array.isArray(data) ? data : []);
      if (!valor) {
        setAmigos(Array.isArray(data.amigos) ? data.amigos : []);
      }
    } catch {
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDados('');
  }, []);

  const alternarAmizade = async (usuarioId: string, isFriend: boolean) => {
    setFeedback('');

    const response = await fetch('/api/amigos', {
      method: isFriend ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId }),
    });

    const data = await response.json();
    if (!response.ok) {
      setFeedback(data.message || (isFriend ? 'Não foi possível desfazer a amizade' : 'Não foi possível adicionar este usuário'));
      return;
    }

    setFeedback(data.message || (isFriend ? 'Amizade desfeita com sucesso' : 'Amigo adicionado com sucesso'));
    await carregarDados(query);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="rounded-2xl border border-[#E8D89A] bg-[#FFF8EB] p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-[#4F442E]">Amizades</h1>
          <p className="text-sm text-[#8A7A5B]">Pesquise por nome ou username e adicione alguém à sua lista de amigos.</p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <input
            value={query}
            onChange={(event) => {
              const valor = event.target.value;
              setQuery(valor);
              carregarDados(valor);
            }}
            placeholder="Buscar por nome ou username"
            className="w-full rounded-lg border border-[#E8D89A] bg-white px-4 py-3 outline-none"
          />

          {feedback && <p className="text-sm text-[#4F442E]">{feedback}</p>}

          {isLoading && <p className="text-sm text-[#8A7A5B]">Buscando...</p>}

          {!isLoading && query && resultados.length === 0 && (
            <p className="text-sm text-[#8A7A5B]">Nenhum usuário encontrado.</p>
          )}

          {query && (
            <div className="flex flex-col gap-3">
              {resultados.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between rounded-xl border border-[#E8D89A] bg-white p-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/perfil/${usuario.username}`} className="relative h-12 w-12 overflow-hidden rounded-full cursor-pointer">
                      <img src={usuario.foto || '/temp/unkown.jpg'} alt={usuario.nome} className="object-cover w-[50px] h-[50px]" />
                    </Link>
                    <div>
                      <Link href={`/perfil/${usuario.username}`} className="font-semibold text-[#4F442E] cursor-pointer">
                        {usuario.nome}
                      </Link>
                      <p className="text-sm text-[#8A7A5B]">@{usuario.username}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      alternarAmizade(usuario.id, Boolean(usuario.isFriend));
                    }}
                    className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold ${usuario.isFriend ? 'bg-[#E8D89A] text-[#4F442E]' : 'bg-[#4F442E] text-white'}`}
                  >
                    {usuario.isFriend ? 'Desfazer amizade' : 'Adicionar'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-[#4F442E]">Seus amigos</h2>
              {amigos.length === 0 && <p className="text-sm text-[#8A7A5B]">Você ainda não adicionou amigos.</p>}
              {amigos.map((amigo) => (
                <div key={amigo.id} className="flex items-center justify-between rounded-xl border border-[#E8D89A] bg-white p-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/perfil/${amigo.username}`} className="relative h-12 w-12 overflow-hidden rounded-full cursor-pointer">
                      <Image src={amigo.foto || '/temp/calca.jpeg'} alt={amigo.nome} fill className="object-cover" />
                    </Link>
                    <div>
                      <Link href={`/perfil/${amigo.username}`} className="font-semibold text-[#4F442E] cursor-pointer">
                        {amigo.nome}
                      </Link>
                      <p className="text-sm text-[#8A7A5B]">@{amigo.username}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
