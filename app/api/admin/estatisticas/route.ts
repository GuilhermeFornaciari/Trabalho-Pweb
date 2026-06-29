import { StatsAdmin } from "@/lib/data/estatisticaAdminDAO";

export async function GET() {
  try {
    console.log("chegou em segurança")
    const dados = await StatsAdmin();

    return Response.json(dados, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        erro: "Erro ao processar métricas.",
      },
      {
        status: 500,
      }
    );
  }
}