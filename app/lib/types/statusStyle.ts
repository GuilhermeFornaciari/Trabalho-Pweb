import { StatusLeitura } from "../prisma/generated/enums";

export const statusStyle: Record<StatusLeitura,{background: string; accent: string;}> = {
    [StatusLeitura.QUERO_LER]: {
      background: "bg-indigo-500",
      accent: "accent-indigo-500",
    },
    [StatusLeitura.LENDO]: {
      background: "bg-yellow-400",
      accent: "accent-yellow-400",
    },
    [StatusLeitura.LIDO]: {
      background: "bg-green-500",
      accent: "accent-green-500",
    },
    [StatusLeitura.ABANDONEI]: {
      background: "bg-red-500",
      accent: "accent-red-500",
    },
  };