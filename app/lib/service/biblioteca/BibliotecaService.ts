import Biblioteca from "@/(entidades)/biblioteca";
import { salvarLivro } from "@/lib/data/bibliotecaDAO";

export async function save(biblioteca: Biblioteca) {
  try {
    const resultado = await salvarLivro(biblioteca);
    return {resultado, status: 200};
  } catch(e) {
    console.error(e);
    return {message: "Não foi possível salvar o status do livro na biblioteca.", status: 500}
  }
}