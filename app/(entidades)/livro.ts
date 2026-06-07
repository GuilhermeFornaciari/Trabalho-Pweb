import Autor from "./autor";

export default class Livro {
  public id?:number;
  public titulo;
  public ano;
  public genero;
  public paginas;
  public capa;
  public autores;
  public sinopse;
  public created_at?:Date;

  constructor(titulo:string, ano:number, genero:string, paginas:number, capa:string, autores:number[], sinopse: string) {
    this.titulo = titulo;
    this.ano = ano;
    this.genero = genero;
    this.paginas = paginas;
    this.capa = capa;
    this.sinopse = sinopse;
    this.autores = autores;
  }
}