import { StatusLeitura } from "../prisma/generated/enums";

export const statusStyle: Record<StatusLeitura,{background: string; accent: string; border: string;}> = {
    [StatusLeitura.QUERO_LER]: {
      background: "bg-indigo-500",
      accent: "accent-indigo-500",
      border: "border-indigo-500",
    },
    [StatusLeitura.LENDO]: {
      background: "bg-yellow-400",
      accent: "accent-yellow-400",
      border: "border-yellow-400",
    },
    [StatusLeitura.LIDO]: {
      background: "bg-green-500",
      accent: "accent-green-500",
      border: "border-green-500",
    },
    [StatusLeitura.ABANDONEI]: {
      background: "bg-red-500",
      accent: "accent-red-500",
      border: "border-red-500",
    },
  };