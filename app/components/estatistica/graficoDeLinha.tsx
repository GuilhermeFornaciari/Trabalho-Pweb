'use client';

import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer} from "recharts";


interface GraficoLinhaProps<T> {
  dados: T[];
  titulo: string;
  eixoXKey: keyof T;
  eixoYKey: keyof T;
  nomeLegenda: string;
  sufixoX?: string;
  sufixoY?: string;
}

export default function GraficoDeLinha<T>({
  dados,
  titulo,
  eixoXKey,
  eixoYKey,
  nomeLegenda,
  sufixoX = "",
  sufixoY = "",
}: GraficoLinhaProps<T>) {
  if(!dados || dados.length === 0) {
    return(
      <h1>Não há dados para exibir</h1>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        {titulo}
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={dados}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey={eixoXKey as string}
            tickFormatter={(v) => `${v}${sufixoX}`}
            stroke="#6b7280"
          />

          <YAxis stroke="#6b7280" />

          <Tooltip
            formatter={(value) => [`${value} ${sufixoY}`.trim(), nomeLegenda]}
            labelFormatter={(label) => `${label}${sufixoX}`}
          />
          
          <Legend verticalAlign="bottom" height={36} />
          
          <Line
            type="monotone"
            dataKey={eixoYKey as string}
            name={nomeLegenda}
            stroke="#f59e0b"
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}