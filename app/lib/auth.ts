import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"; 
import PrismaSingleton from "@/lib/prisma/PrismaSingleton"; 
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
          username: usuario.username,
          dataNascimento: usuario.dataNascimento
        }
      }
    }) 
  ],
  callbacks: {
    async jwt({token, user}) {
      if(user) {
        token.role = user.role;
        token.username = user.username;
        token.foto = user.foto;
        token.dataNascimento = (user.dataNascimento) ? user.dataNascimento.toISOString() : '';
      }
      return token;
    },

    async session({session, token}) {
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.foto = token.foto;
      session.user.dataNascimento = (token.dataNascimento.length > 0) ? new Date(token.dataNascimento) : null;

      return session;
    }
  }
});