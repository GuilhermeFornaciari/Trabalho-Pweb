import { getLivrosRecentes, getLivroById } from "@/lib/data/livroDAO";

export async function livrosRecentes(quantidade: number) {
  try {
    const res = await getLivrosRecentes(quantidade);
    if(res === null) {
      return {message: "Não foi possível buscar livros recentes", status: 500}
    }
    return {res, status: 200};
  } catch(e) {
    return {status:500, message: 'Não foi possível buscar livros recentes.'}
  }
}

// cortei esse benny
// export async function getById(id: number) {
//   try {
//     const res = await getLivroById(id);
//     if(res === null) {
//       return {status: 404, message: 'Livro não encontrado'}
//     }
//     return res;
//   } catch(e) {
//     return {status:500, message: 'Não foi possível buscar este livro.'}
//   }
// }