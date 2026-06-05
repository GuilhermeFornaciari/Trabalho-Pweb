export default class Livro {
  public id?:number;
  public titulo;
  public ano;
  public genero;
  public paginas;
  public capa;
  public created_at?:Date;

  constructor(titulo:string, ano:number, genero:string, paginas:number, capa:string) {
    this.titulo = titulo;
    this.ano = ano;
    this.genero = genero;
    this.paginas = paginas;
    this.capa = capa;
  }
}