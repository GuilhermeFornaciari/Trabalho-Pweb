'use client';

import { useState } from "react";

type Props = {
  livroId: number;
  dataInicio: Date | null;
  dataFim: Date | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditarDatas({
  livroId,
  dataInicio,
  dataFim,
  onClose,
  onSuccess
}: Props) {
  const [inicio, setInicio] = useState(
    dataInicio ? new Date(dataInicio).toISOString().split("T")[0] : ""
  );

  const [fim, setFim] = useState(
    dataFim ? new Date(dataFim).toISOString().split("T")[0] : ""
  );

  const [loading, setLoading] = useState(false);

  async function salvar() {
    setLoading(true);

    const response = await fetch("/api/biblioteca/datas", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        livroId,
        dataInicio: inicio || null,
        dataFim: fim || null,
      }),
    });

    setLoading(false);
    console.log(response);

    if(response.ok) {
      onSuccess();
      onClose();
    } else {
      alert("Ocorreu um erro ao salvar as datas.");
    }
  }

  return (
    <div className="flex flex-col gap-4 bg-white rounded-md p-5">
      <h1 className="font-bold font-lg">Informe o perído da sua leitura</h1>
      <div>
        <label>Data de início</label>
        <input
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label>Data de término</label>
        <input
          type="date"
          value={fim}
          onChange={(e) => setFim(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onClose}>
          Cancelar
        </button>

        <button
          onClick={salvar}
          disabled={loading}
          className="bg-yellow-400 px-4 py-2 rounded"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}