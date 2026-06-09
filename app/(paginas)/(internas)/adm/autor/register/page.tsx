'use client'

import { useState } from "react";
import Link from "next/link";

export default function RegisterAuthor() {
  const [autor, setAutor] = useState("");
  
  async function cadastrar() {
      if(!autor) {
        alert(`O campo não foi preenchido!`);
        return;
      }

  const body = {
        nome: autor,
    };

    const res = await fetch("/api/autor/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(`O autor ${data.nome} foi criado com sucesso. Id: ${data.id}`)
    console.log(data);
  }


  const labelStyle = "block py-2 flex flex-col text-lg";
  const spanStyle = "mr-2 color-black";
  const inputStyle = "px-2 border border-yellow-300 py-px outline-0 bg-white rounded-sm";

  return (
      <div className="flex flex-col flex-1 items-center justify-center p-10">
        <h1 className="text-slate-700 text-3xl font-semibold mb-3">Cadastro de autor</h1>
        <div className="w-md my-5 mx-auto border border-yellow-300 bg-amber-50 p-3 rounded-2xl">
          <form 
            id="formulario"
            name="formulario"
          >
            <label className={labelStyle}>
              <span className={spanStyle}>Nome</span>
              <input type="text" name="nome" id="nome" className={inputStyle} value={autor} onChange={(e) => setAutor(e.target.value)} required/>
            </label>


          </form>

        </div>
        <div className="w-md flex justify-between">
          <button className="p-3 font-semibold bg-yellow-500 border border-yellow-500 ease-in-out durantion-500 hover:bg-yellow-400 hover:shadow-[0_0_3px_rgb(3,3,3)] hover:border-slate-700 shadow-indigo-950 rounded-lg" 
          onClick={cadastrar}>
            Confirmar
          </button>
          <Link href="/" className="p-3 font-semibold bg-red-600 hover:bg-rose-700 rounded-lg text-olive-50">Cancelar</Link>
        </div>
      </div>
  );
}