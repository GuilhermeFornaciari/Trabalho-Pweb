// 'use client'

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";

// type UserFormData = {
//   nome  :String;
//   email :String; 
//   senha :String;
//   foto  :String;
// };

// type LivroFormProps = {
//   descricao: string;
//   usuario: UserFormData;
//   onSubmit: (dados: UserFormData) => Promise<void>;
// };

// export default function LivroForm({
//   descricao,
//   usuario,
//   onSubmit
// }:LivroFormProps ) {
//    const [form, setForm] = useState<UserFormData>(
//     usuario ?? {
//       nome: "",
//       email: "",
//       senha: "",
//       foto: "",
//     }
//   );

//   async function handleSubmit() {
//     for (const [campo, valor] of Object.entries(form)) {
//       if (!valor) {
//         alert(`O campo ${campo} não foi preenchido!`);
//         return;
//       }
//     }

//     await onSubmit(form, autores);
//   }

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
//     const { name, value } = e.target;

//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   }

//   function adicionarAutor(autor: Autor) {
//     const jaExiste = autores.some(a => a.id === autor.id);
//     if(jaExiste) return;
//     setAutores(prev => [...prev, autor]);
//   }

//   function removerAutor(id: number) {
//     setAutores(prev =>
//       prev.filter(a => a.id !== id)
//     );
//   }

//   useEffect(() => {
//     if (!buscaAutor.trim()) {
//       setResultadosAutores([]);
//       return;
//     }

//     const timeout = setTimeout(async () => {
//       const res = await fetch(
//         `/api/autor/read?nome=${encodeURIComponent(buscaAutor)}`
//       );

//       const data = await res.json();
//       setResultadosAutores(data);
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [buscaAutor]);

//   const labelStyle = "block py-2 flex flex-col text-lg";
//   const spanStyle = "mr-2 color-black";
//   const inputStyle = "px-2 border border-yellow-300 py-px outline-0 bg-white rounded-sm text-base";
//   const formContainerStyle = "w-1/2 py-3 px-5 flex flex-col";
//   const textareaStyle = inputStyle + " resize-none flex-1 min-h-20";

//   return (
//       <div className="flex flex-col flex-1 items-center justify-center h-full p-10">
//         <h1 className="text-slate-700 text-3xl font-semibold mb-3">{descricao}</h1>
//         <div className="w-5xl my-5 mx-auto border border-yellow-300 bg-amber-50 rounded-2xl">
//           <form 
//             id="formulario"
//             name="formulario"
//             className="w-full flex flex-between"
//           >
//             <div className={formContainerStyle}>
//               <label className={labelStyle}>
//                 <span className={spanStyle}>Título</span>
//                 <input type="text" name="titulo" id="titulo" className={inputStyle} value={form.titulo} onChange={handleChange} required/>
//               </label>
//               <label className={labelStyle}>
//                 <span className={spanStyle}>Ano</span>
//                 <input type="number" name="ano" id="ano" className={inputStyle} value={form.ano} onChange={handleChange} required/>
//               </label>
//               <label className={labelStyle}>
//                 <span className={spanStyle}>Gênero</span>
//                 <input type="text" name="genero" id="genero" className={inputStyle} value={form.genero} onChange={handleChange} required/>
//               </label>
//               <label className={labelStyle}>
//                 <span className={spanStyle}>Quantidade de páginas</span>
//                 <input type="number" name="paginas" id="paginas" className={inputStyle} value={form.paginas} onChange={handleChange} required/>
//               </label>
//             </div>
//             <div className={formContainerStyle}>
//               <label className={labelStyle}>
//                 <span className={spanStyle}>Capa</span>
//                 <input type="text" name="capa" id="capa" className={inputStyle} value={form.capa} onChange={handleChange} required/>
//               </label>
//               <label className={labelStyle}>
//                 <span className={spanStyle}>Autor</span>
//                 <input type="text" name="autor" id="autor"placeholder="Pesquisar autores" className={inputStyle} value={buscaAutor} onChange={(e) => setBuscaAutor(e.target.value)} required/>
//               </label>
//               {(autores.length === 0) ? '' :
//                 <div className="flex justify-start items-center flex-wrap p-1">
//                   {autores.map((autor) => (
//                     <span
//                       key={autor.id}
//                       className="px-2 py-1 rounded bg-yellow-200 me-1 mb-1"
//                     >
//                       {autor.nome}

//                       <button
//                         type="button"
//                         onClick={() =>
//                           removerAutor(autor.id)
//                         }
//                         className="mx-2"
//                         >
//                         <Image unoptimized src="/remover.png" width={20} height={20} alt="Remover"></Image>
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               }
//               {(resultadosAutores.length === 0) ? '' :
//                 <div className="border border-yellow-300 p-1 rounded-sm">
//                   {resultadosAutores.map((autor) => (
//                     <button
//                     key={autor.id}
//                     type="button"
//                     onClick={() => adicionarAutor(autor)}
//                     className="box-border border-amber-400 text-sm bg-amber-400 border-2 hover:border-black hover:bg-yellow-400 w-full rounded-md text-start p-2 shadow-black"
//                     >
//                       {autor.nome}
//                     </button>
//                   ))}
//                 </div>
//               }
//               <label className={labelStyle + "flex flex-col flex-1"}>
//                 <span className={spanStyle}>Sinopse</span>
//                 <textarea name="sinopse" id="sinopse" value={form.sinopse} onChange={handleChange} className={textareaStyle}></textarea>
//               </label>
//             </div>

//           </form>

//         </div>
//         <div className="w-md flex justify-between">
//           <button className="p-3 font-semibold bg-yellow-500 border border-yellow-500 ease-in-out durantion-500 hover:bg-yellow-400 hover:shadow-[0_0_3px_rgb(3,3,3)] hover:border-slate-700 shadow-indigo-950 rounded-lg" 
//           onClick={handleSubmit}>
//             Confirmar
//           </button>
//           <Link href="/catalogo" className="p-3 font-semibold bg-red-600 hover:bg-rose-700 rounded-lg text-olive-50">Cancelar</Link>
//         </div>
//       </div>
//   );
// }