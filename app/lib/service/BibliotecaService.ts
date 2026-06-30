import Biblioteca from "@/(entidades)/biblioteca";
import { salvarLivro, saveDates } from "@/lib/data/bibliotecaDAO";

export async function save(biblioteca: Biblioteca) {
  try {
    const dados = await salvarLivro(biblioteca);
    return {dados, status: 200};
  } catch(e) {
    console.error(e);
    return {message: "Não foi possível salvar o status do livro na biblioteca.", status: 500}
  }
}

export async function updateDates(usuarioId: string, livroId: number , dataInicial: Date | undefined, dataFinal: Date | undefined) {
  try {
    const dados = await saveDates(usuarioId, livroId, dataInicial ?? null, dataFinal ?? null);
    return {dados, status: 200};
  } catch(e) {
    console.error(e);
    return {message: "Não foi possível salvar o status do livro na biblioteca.", status: 500}
  }
}