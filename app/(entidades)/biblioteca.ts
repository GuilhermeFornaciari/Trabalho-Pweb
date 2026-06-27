import { StatusLeitura } from "@/lib/prisma/generated/enums";

export default class Biblioteca {
  public usuarioId;
  public livroId;
  public status;
  public dataInicio;
  public dataConclusao;

  constructor(usuarioId: string, livroId: number, status: StatusLeitura, dataInicio: Date | null, dataConclusao: Date | null) {
    this.usuarioId = usuarioId;
    this.livroId = livroId;
    this.status = status;
    this.dataInicio = dataInicio;
    this.dataConclusao = dataConclusao;
  }
}