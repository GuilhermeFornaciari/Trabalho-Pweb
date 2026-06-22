import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
      foto: string;
      dataNascimento: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    nome: string;
    email: string;
    role: string;
    username: string;
    foto: string;
    dataNascimento: Date | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: string;
    username: string;
    foto: string;
    dataNascimento: string;
  }
}