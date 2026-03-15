import { NextRequest, NextResponse } from "next/server";
import { getDeputadoExpensesSummary } from "@/lib/services/camaraExpensesService";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const deputadoId = Number(params.id);

  if (!Number.isFinite(deputadoId) || deputadoId <= 0) {
    return NextResponse.json({ error: "ID de deputado inválido." }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const ano = Number(searchParams.get("ano") || "");
  const mes = Number(searchParams.get("mes") || "");
  const pagina = Number(searchParams.get("pagina") || "");
  const itensPorPagina = Number(searchParams.get("itensPorPagina") || "");
  const categoria = searchParams.get("categoria") || undefined;

  try {
    const result = await getDeputadoExpensesSummary(deputadoId, {
      ano: Number.isFinite(ano) && ano > 0 ? ano : undefined,
      mes: Number.isFinite(mes) && mes > 0 ? mes : undefined,
      pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : undefined,
      itensPorPagina:
        Number.isFinite(itensPorPagina) && itensPorPagina > 0 ? itensPorPagina : undefined,
      categoria,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Não foi possível buscar resumo de despesas do deputado.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 502 },
    );
  }
}
