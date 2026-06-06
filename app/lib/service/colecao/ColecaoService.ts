"use server"

import { find } from "@/lib/data/userDAO";


export async function colecaoCreate( nome: string) {
  const colection = await find(nome);

  if (!colection) {
    throw new Error("Erro criar coleção")
    return null;
  }


  return colection;
}



