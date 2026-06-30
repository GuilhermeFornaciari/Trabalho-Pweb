-- CreateEnum
CREATE TYPE "StatusLeitura" AS ENUM ('LIDO', 'LENDO', 'QUERO_LER', 'ABANDONEI');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "foto" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "username" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "livros" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "genero" TEXT NOT NULL,
    "paginas" INTEGER NOT NULL,
    "capa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sinopse" TEXT NOT NULL,
    "colecaoId" INTEGER,
    "posicao_colecao" DOUBLE PRECISION,

    CONSTRAINT "livros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colecao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "colecao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrito_por" (
    "livroId" INTEGER NOT NULL,
    "autorId" INTEGER NOT NULL,

    CONSTRAINT "escrito_por_pkey" PRIMARY KEY ("livroId","autorId")
);

-- CreateTable
CREATE TABLE "postagens" (
    "id" SERIAL NOT NULL,
    "paginaAtual" INTEGER,
    "paginasLidas" INTEGER,
    "nota" INTEGER,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "texto" TEXT,
    "temSpoiler" BOOLEAN,
    "usuario_id" TEXT NOT NULL,
    "livro_id" INTEGER NOT NULL,
    "titulo" TEXT,

    CONSTRAINT "postagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "texto" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "postagem_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biblioteca" (
    "usuario_id" TEXT NOT NULL,
    "livro_id" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3),
    "data_conclusao" TIMESTAMP(3),
    "nota" INTEGER,
    "paginaAtual" INTEGER,
    "status" "StatusLeitura" NOT NULL,

    CONSTRAINT "biblioteca_pkey" PRIMARY KEY ("usuario_id","livro_id")
);

-- CreateTable
CREATE TABLE "curtidas" (
    "id" SERIAL NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "postagem_id" INTEGER,
    "comentario_id" INTEGER,

    CONSTRAINT "curtidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amigos" (
    "amigo1_id" TEXT NOT NULL,
    "amigo2_id" TEXT NOT NULL,

    CONSTRAINT "amigos_pkey" PRIMARY KEY ("amigo1_id","amigo2_id")
);

-- CreateIndex
CREATE UNIQUE INDEX idx_uma_resenha_por_livro ON postagens (usuario_id, livro_id) WHERE nota IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "livros_colecaoId_posicao_colecao_key" ON "livros"("colecaoId", "posicao_colecao");

-- CreateIndex
CREATE INDEX "postagens_data_idx" ON "postagens"("data");

-- CreateIndex
CREATE INDEX "postagens_usuario_id_idx" ON "postagens"("usuario_id");

-- CreateIndex
CREATE INDEX "postagens_livro_id_idx" ON "postagens"("livro_id");

-- CreateIndex
CREATE INDEX "postagens_livro_id_data_idx" ON "postagens"("livro_id", "data");

-- CreateIndex
CREATE INDEX "apenas_uma_resenha_por_livro" ON "postagens"("usuario_id", "livro_id");

-- CreateIndex
CREATE INDEX "comentarios_postagem_id_data_idx" ON "comentarios"("postagem_id", "data");

-- CreateIndex
CREATE INDEX "comentarios_usuario_id_idx" ON "comentarios"("usuario_id");

-- CreateIndex
CREATE INDEX "comentarios_parent_id_idx" ON "comentarios"("parent_id");

-- CreateIndex
CREATE INDEX "curtidas_postagem_id_idx" ON "curtidas"("postagem_id");

-- CreateIndex
CREATE INDEX "curtidas_comentario_id_idx" ON "curtidas"("comentario_id");

-- CreateIndex
CREATE UNIQUE INDEX "curtidas_usuario_id_comentario_id_key" ON "curtidas"("usuario_id", "comentario_id");

-- CreateIndex
CREATE UNIQUE INDEX "curtidas_usuario_id_postagem_id_key" ON "curtidas"("usuario_id", "postagem_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "livros" ADD CONSTRAINT "livros_colecaoId_fkey" FOREIGN KEY ("colecaoId") REFERENCES "colecao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrito_por" ADD CONSTRAINT "escrito_por_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "autor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrito_por" ADD CONSTRAINT "escrito_por_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "livros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postagens" ADD CONSTRAINT "postagens_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postagens" ADD CONSTRAINT "postagens_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comentarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_postagem_id_fkey" FOREIGN KEY ("postagem_id") REFERENCES "postagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "livros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "biblioteca" ADD CONSTRAINT "biblioteca_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curtidas" ADD CONSTRAINT "curtidas_comentario_id_fkey" FOREIGN KEY ("comentario_id") REFERENCES "comentarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curtidas" ADD CONSTRAINT "curtidas_postagem_id_fkey" FOREIGN KEY ("postagem_id") REFERENCES "postagens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curtidas" ADD CONSTRAINT "curtidas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amigos" ADD CONSTRAINT "amigos_amigo1_id_fkey" FOREIGN KEY ("amigo1_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amigos" ADD CONSTRAINT "amigos_amigo2_id_fkey" FOREIGN KEY ("amigo2_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
