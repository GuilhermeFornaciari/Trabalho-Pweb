import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "app/lib/prisma/schema.prisma",
  migrations: {
    path: "app/lib/prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
