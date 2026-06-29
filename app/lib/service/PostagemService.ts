import { Postagem } from "../prisma/generated/client";
import { find, deletePost, createProgresso, ultimoProgresso, updateProgresso } from "../data/postagemDAO";

export async function getPost(postId: number) {
  try {
    const post = await find(postId);
    return {dados: post, status: 200};
  } catch (e) {
    console.error(e);
    return { message: "Não foi possível salvar o progresso.", status: 500 };
  }
}

export async function addProgresso(dados: Omit<Postagem, "id">) {
  try {
    const resultado = await createProgresso(dados);
    if(!resultado) {
      return { message: "Não foi possível salvar o progresso.", status: 500 };
    }
    return {dados: resultado, status: 200}

  } catch (e) {
    console.error(e);
    return { message: "Não foi possível salvar o progresso.", status: 500 };
  }
}

export async function getUltimoProgresso(usuarioId: string, livroId: number) {
  try {
    const resultado = await ultimoProgresso(usuarioId, livroId);
    return {dados: resultado, status: 200}

  } catch(e) {
    console.error(e);
    return { message: "Não foi possível recuperar o último progresso.", status: 500 };
  }
} 

export async function deletarPostagem(usuarioId: string, postId: number) {
  const post = await getPost(postId);
  if(!post || post.status !== 200) {
    return post;
  }

  if(post.dados?.usuarioId !== usuarioId) {
    return {message: "Não é possível remover o post de outro usuário", status: 401};
  }

  try {
    const resultado = deletePost(post.dados, usuarioId, post.dados.livroId);
    if(!resultado) {
      return {success: false, status: 500}
    }
    return {success: true, status: 200}
  } catch(e) {
    console.error(e);
    return { message: "Ocorreu um erro ao deletar postagem", status: 500 };
  }
}

export async function editarProgresso(usuarioId: string, dados: any) {
  const post = await getPost(dados.postId);
  if(!post || post.status !== 200) {
    return post;
  }

  if(post.dados?.usuarioId !== usuarioId) {
    return {message: "Não é possível editar o progresso de outro usuário", status: 401};
  }

  try {
    const resultado = await updateProgresso(usuarioId, dados);
    if(!resultado) {
      return {dados: null, status: 500}
    }
    return {dados: resultado, status: 200}
  } catch(e) {
    console.error(e);
    return { message: "Ocorreu um erro ao deletar postagem", status: 500 };
  }
}