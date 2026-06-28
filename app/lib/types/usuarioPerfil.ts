import { Livro, Biblioteca, User } from "../prisma/generated/client";

export type UsuarioPerfil = User & {
  biblioteca: (Biblioteca & {
    livro: Livro;
  })[];
};