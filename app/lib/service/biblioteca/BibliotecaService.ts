import Biblioteca from "@/(entidades)/biblioteca";
import { adicionarLivro } from "@/lib/data/bibliotecaDAO";

export async function add(biblioteca: Biblioteca) {
  try {
    const resultado = await adicionarLivro(biblioteca);
    return {resultado, status: 200};
  } catch(e) {
    console.error(e);
    return {message: "Não foi possível adicionar o livro na biblioteca.", status: 500}
  }
}