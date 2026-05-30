import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg"

export default class PrismaSingleton {
  private static instance: PrismaSingleton;

  prismaClient: PrismaClient
  private constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    this.prismaClient = new PrismaClient({ adapter });

  }

  // Ponto de acesso global
  public static getInstance(): PrismaSingleton {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton();
    }
    return PrismaSingleton.instance;
  }

}