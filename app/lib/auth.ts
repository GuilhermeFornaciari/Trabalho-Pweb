import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"; 
import PrismaSingleton from "@/lib/prisma/PrismaSingleton"; 
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { find } from "./data/userDAO";

const prisma = PrismaSingleton.getInstance().prismaClient;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), 
  providers: [
    Credentials({
      credentials: {
        login: {},
        password: {}
      },
      async authorize(credentials) {
        const login = credentials.login as string;
        const password = credentials.password as string;

        const usuario = await prisma.user.findFirst({
          where: {
            OR: [
              {email: login},
              {username: login}
            ]
          }
        })

        if(!usuario) {
          return null;
        }

        const validPassword = await bcrypt.compare(
          password,
          usuario.senha
        );

        if(!validPassword) {
          return null;
        }

        return {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          foto: usuario.foto,
          role: usuario.role,
          bio: usuario.bio,
          username: usuario.username,
          dataNascimento: usuario.dataNascimento
        }
      }
    }) 
  ],
  callbacks: {
    async jwt({token, user, trigger}) {
      if (trigger === "update") {
        const usuario = await find(token.sub!);

        if (usuario) {
          token.nome = usuario.nome;
          token.email = usuario.email;
          token.username = usuario.username;
          token.bio = usuario.bio;
          token.foto = usuario.foto;
          token.role = usuario.role;
          token.dataNascimento = usuario.dataNascimento ? usuario.dataNascimento.toISOString() : '';
        }
        return token;
     }


      if(user) {
        token.role = user.role;
        token.username = user.username;
        token.email = user.email;
        token.foto = user.foto;
        token.nome = user.nome;
        token.dataNascimento = (user.dataNascimento) ? user.dataNascimento.toISOString() : '';
        token.bio = user.bio;
      }
      return token;
    },

    async session({session, token}) {
      session.user.id = token.sub!;
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.foto = token.foto;
      session.user.nome = token.nome;
      session.user.dataNascimento = (token.dataNascimento.length > 0) ? new Date(token.dataNascimento) : null;
      session.user.bio = token.bio;

      return session;
    }
  },
  session: {
    strategy: "jwt",
  }
});