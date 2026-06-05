'use client'

import Header from "@/components/header";

export default function RegisterBook() {
  const labelStyle = "block";
  const spanStyle = "mr-2 color-black";
  return (
    <div className="min-h-screen bg-amber-100 min-h-screen">
      <Header></Header>
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-yellow-700 text-3xl font-semibold mb-3">Cadastro de livro</h1>
        <div className="w-7xl m-auto bg-amber-50 p-3 rounded-2xl shadow-xs">
          <form 
            id="formulario"
            name="formulario"
            
          >
            <label className={labelStyle}>
              <span className={spanStyle}>Titulo:</span>
              <input type="text" name="titulo" id="titulo" required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Ano:</span>
              <input type="number" name="titulo" id="titulo" required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Gênero:</span>
              <input type="text" name="titulo" id="titulo" required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Quantidade de páginas:</span>
              <input type="number" name="titulo" id="titulo" required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Capa:</span>
              <input type="text" name="titulo" id="titulo" required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Autor:</span>
              <input type="number" name="titulo" id="titulo" required/>
            </label>

          </form>
        </div>
      </div>
    </div>
  );
}