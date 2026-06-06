import { getLivrosRecentes } from "@/lib/data/livroDAO";

export async function livrosRecentes(quantidade: number) {
  try {
    const res = await getLivrosRecentes(quantidade);
    return res;
  } catch(e) {
    return {status:500, message: 'Não foi possível buscar livros recentes.'}
  }
}