'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GraficoBarrasProps<T> {
  dados: T[];
  titulo: string;
  eixoXKey: keyof T;
  eixoYKey: keyof T;
  nomeLegenda?: string;
  sufixoValue?: string;
  orientacao?: "vertical" | "horizontal";
  className: string
}

export default function GraficoDeBarras<T>({
  dados,
  titulo,
  eixoXKey,
  eixoYKey,
  nomeLegenda = "Quantidade",
  sufixoValue = "",
  orientacao = "horizontal",
  className,
}: GraficoBarrasProps<T>) {
  
  const isHorizontal = orientacao === "horizontal";

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        {titulo}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={dados}
          layout={isHorizontal ? "horizontal" : "vertical"}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />
          {isHorizontal ? (
            <>
              <XAxis dataKey={eixoXKey as string} stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
            </>
          ) : (
            <>
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey={eixoXKey as string} type="category" stroke="#6b7280" width={100} />
            </>
          )}

          <Tooltip formatter={(value) => [`${value}${sufixoValue}`, nomeLegenda]} />
          <Legend verticalAlign="bottom" height={36} />

          <Bar
            dataKey={(isHorizontal ? eixoYKey : eixoYKey) as string}
            name={nomeLegenda}
            fill="#8884d8"
            radius={isHorizontal ? [4, 4, 0, 0] : [0, 4, 4, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}