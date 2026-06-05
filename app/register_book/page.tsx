'use client'

import { useState } from "react";
import Header from "@/components/header";
import Link from "next/link";

export default function RegisterBook() {
  const [form, setForm] = useState({
    titulo: "",
    ano: "",
    genero: "",
    paginas: "",
    capa: "",
    autor: ""
  })
  
async function cadastrar() {
  for (const [campo, valor] of Object.entries(form)) {
    if (!valor) {
      alert(`O campo ${campo} não foi preenchido!`);
      return;
    }
  }

  const body = {
      titulo: form.titulo,
      ano: Number(form.ano),
      genero: form.genero,
      paginas: Number(form.paginas),
      capa: form.capa,
      autores: form.autor
        .split(",")
        .map(id => Number(id.trim()))
        .filter(id => !isNaN(id))
    };

    const res = await fetch("/api/livro/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert(`O livro ${data.titulo} foi criado com sucesso. Id: ${data.id}`)
    console.log(data);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const labelStyle = "block py-2 flex flex-col";
  const spanStyle = "mr-2 color-black";
  const inputStyle = "px-2 border border-yellow-300 py-px outline-0 bg-white text-amber-100 rounded-sm";

  return (
    <div className="min-h-screen bg-olive-50 min-h-screen">
      <Header></Header>
      <div className="flex flex-col items-center justify-center p-10">
        <h1 className="text-yellow-700 text-3xl font-semibold mb-3">Cadastro de livro</h1>
        <div className="w-md my-5 mx-auto border border-yellow-300 bg-amber-50 p-3 rounded-2xl">
          <form 
            id="formulario"
            name="formulario"
          >
            <label className={labelStyle}>
              <span className={spanStyle}>Título</span>
              <input type="text" name="titulo" id="titulo" className={inputStyle} value={form.titulo} onChange={handleChange} required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Ano</span>
              <input type="number" name="ano" id="ano" className={inputStyle} value={form.ano} onChange={handleChange} required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Gênero</span>
              <input type="text" name="genero" id="genero" className={inputStyle} value={form.genero} onChange={handleChange} required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Quantidade de páginas</span>
              <input type="number" name="paginas" id="paginas" className={inputStyle} value={form.paginas} onChange={handleChange} required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Capa</span>
              <input type="text" name="capa" id="capa" className={inputStyle} value={form.capa} onChange={handleChange} required/>
            </label>
            <label className={labelStyle}>
              <span className={spanStyle}>Autor</span>
              <input type="text" name="autor" id="autor" className={inputStyle} value={form.autor} onChange={handleChange} required/>
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
    </div>
  );
}