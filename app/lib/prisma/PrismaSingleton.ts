import "dotenv/config";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";

export default class PrismaSingleton {
  private static instance: PrismaSingleton;

  prismaClient: PrismaClient
  private constructor() {
 
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: {
       ca: fs.readFileSync("./ca.pem", "utf8"),
       rejectUnauthorized: true,
      },
    });

    console.log("conectou");
  
    const adapter = new PrismaPg( pool );
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